---
title: "CP Badges"
description: "Edge API serving competitive-programming rating badges for READMEs and portfolios."
repo: "CP-Badges"
url: "https://github.com/AkshatAggarwal14/CP-Badges"
language: "TypeScript"
stars: 2
demo: "https://cp-badge-render.vercel.app/codeforces/master._.mind"
stack: ["TypeScript", "Vercel Edge", "SVG badges"]
order: 4
---

Rewritten as a zero-dependency TypeScript Edge Function for Vercel (v2.0.0, no runtime dependencies).

Endpoints cover Codeforces, CodeChef, AtCoder, TopCoder, Yukicoder, and LeetCode, keyed by username, plus usage at `GET /` and `GET /health`. Badge color tracks each rating band of the platform it represents; unknown users render a grey `unknown` badge instead of breaking the README.

Responses are cached at the edge (`s-maxage=3600`) so profiles stay fast without hammering upstreams.

## Live examples

Rendered right now by the API above — click any badge to open the profile:

[![Codeforces](https://cp-badge-render.vercel.app/codeforces/master._.mind)](https://codeforces.com/profile/master._.mind) [![CodeChef](https://cp-badge-render.vercel.app/codechef/master_mind14)](https://www.codechef.com/users/master_mind14) [![AtCoder](https://cp-badge-render.vercel.app/atcoder/master0_0mind)](https://atcoder.jp/users/master0_0mind) [![TopCoder](https://cp-badge-render.vercel.app/topcoder/master._.mind)](https://profiles.topcoder.com/master._.mind) [![LeetCode](https://cp-badge-render.vercel.app/leetcode/akshataggarwal14)](https://leetcode.com/u/akshataggarwal14) [![YukiCoder](https://cp-badge-render.vercel.app/yukicoder/hos.lyric)](https://yukicoder.me/)
