// Refreshes src/data/cp.json from live sources at build time.
// Never throws: on any failure the committed snapshot is kept so builds stay green.
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = new URL('../src/data/cp.json', import.meta.url);
const UA = { 'User-Agent': 'portfolio-cp-refresh (contact: site owner)' };

async function getJson(url, opts = {}) {
  const res = await fetch(url, { headers: UA, ...opts });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

async function codeforces(handle) {
  const info = await getJson(`https://codeforces.com/api/user.info?handles=${handle}`);
  const user = info.result[0];
  const rating = await getJson(`https://codeforces.com/api/user.rating?handle=${handle}`);
  const pts = rating.result.map((r) => [r.ratingUpdateTimeSeconds, r.newRating]);
  const step = Math.max(1, Math.floor(pts.length / 36));
  const history = pts.filter((_, i) => i % step === 0);
  if (history[history.length - 1] !== pts[pts.length - 1]) history.push(pts[pts.length - 1]);
  return { rating: user.rating, peak: user.maxRating, rank: user.rank[0].toUpperCase() + user.rank.slice(1), contests: String(rating.result.length), history };
}

async function codechef(handle) {
  const res = await fetch(`https://www.codechef.com/users/${handle}`, { headers: { ...UA, 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } });
  if (!res.ok) throw new Error(`codechef -> ${res.status}`);
  const html = await res.text();
  const decode = (start) => {
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < html.length; i++) {
      const c = html[i];
      if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; }
      else if (c === '"') inStr = true;
      else if (c === '[') depth++;
      else if (c === ']') { depth--; if (depth === 0) return html.slice(start, i + 1); }
    }
    throw new Error('array end not found');
  };
  const findArray = (key) => {
    const i = html.indexOf(`"${key}":`);
    if (i === -1) throw new Error(`${key} not found`);
    let j = i + key.length + 3;
    while (j < html.length && /\s/.test(html[j])) j++;
    if (html[j] === '{') {
      const k = html.indexOf('"all":', j);
      if (k === -1 || k - j > 500) throw new Error(`${key}.all not found`);
      j = k + 6;
      while (j < html.length && /\s/.test(html[j])) j++;
    }
    if (html[j] !== '[') throw new Error(`${key} not an array`);
    return JSON.parse(decode(j));
  };
  const current = findArray('date_versus_rating');
  const old = findArray('all_old');
  const toTs = (x) => Math.floor(Date.UTC(+x.getyear, +x.getmonth - 1, +x.getday) / 1000);
  return {
    rating: +current[current.length - 1].rating,
    peak: Math.max(...old.map((x) => +x.rating)),
    history: old.map((x) => [toTs(x), +x.rating]),
  };
}

async function leetcode(handle) {
  const query = (q) => getJson('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { ...UA, 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query: q }),
  });
  const { data } = await query(`query { userContestRanking(username: "${handle}") { rating globalRanking topPercentage } matchedUser(username: "${handle}") { submitStats { acSubmissionNum { difficulty count } } } }`);
  const { data: hist } = await query(`query { userContestRankingHistory(username: "${handle}") { contest { startTime } rating } }`);
  const r = data.userContestRanking;
  const solved = data.matchedUser.submitStats.acSubmissionNum.find((s) => s.difficulty === 'All').count;
  return {
    rating: Math.round(r.rating),
    peak: Math.round(r.rating),
    top: r.topPercentage,
    global: r.globalRanking.toLocaleString('en-US') + 'th',
    contests: String(hist.userContestRankingHistory.filter((h) => h.rating != null).length),
    solved: String(solved),
    history: hist.userContestRankingHistory.filter((h) => h.rating != null).map((h) => [h.contest.startTime, Math.round(h.rating)]),
  };
}

const prev = JSON.parse(readFileSync(OUT, 'utf-8'));
const byName = Object.fromEntries(prev.platforms.map((p) => [p.name, p]));
const month = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

try { const cf = await codeforces('master._.mind'); Object.assign(byName.Codeforces, { rating: cf.rating, peak: cf.peak, rank: cf.rank, history: cf.history }); byName.Codeforces.stats = [{ label: 'Contests', value: cf.contests }, { label: 'Current', value: String(cf.rating) }, { label: 'Best round', value: '143rd / 18K+' }]; console.log('CF ok:', cf.rating); }
catch (e) { console.warn('CF skip:', e.message); }

try { const cc = await codechef('master_mind14'); Object.assign(byName.CodeChef, { rating: cc.rating, peak: cc.peak, history: cc.history }); console.log('CC ok:', cc.rating, 'peak', cc.peak); }
catch (e) { console.warn('CC skip:', e.message); }

try { const lc = await leetcode('AkshatAggarwal14'); Object.assign(byName.LeetCode, { rating: lc.rating, peak: lc.peak, rank: `Top ${lc.top.toFixed(1)}%`, history: lc.history }); byName.LeetCode.stats = [{ label: 'Contests', value: lc.contests }, { label: 'Solved', value: lc.solved }, { label: 'Global', value: lc.global }]; console.log('LC ok:', lc.rating); }
catch (e) { console.warn('LC skip:', e.message); }

prev.asOf = month;
writeFileSync(OUT, JSON.stringify(prev, null, 2) + '\n');
console.log('cp.json written, asOf', month);
