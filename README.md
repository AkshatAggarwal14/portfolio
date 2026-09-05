# Personal Space

A dark-first Astro portfolio with a compact card layout, Markdown posts, a printable resume, and direct contact links. No scheduler, contribution graph, backend, or third-party tracking. Fonts are served locally.

## Develop

Requires Node.js 22.12+.

```sh
npm install
npm run dev
```

## Make it yours

- Edit `src/data/site.ts` for your name, bio, tools, project summaries, resume, email, and social URLs.
- Blank social URLs and email addresses render as unconfigured labels, not fake working links. Set the URLs to enable them.
- Posts live in `src/content/posts/` as Markdown. The current posts were imported from Medium (full text, with a canonical "Originally published on Medium" link on each article). Set `sample: false` on your own posts; anything with `sample: true` shows a sample banner.
- Work projects live in the `work` array in `src/data/site.ts`, sourced from your public GitHub repos, and render on `/work/` plus the homepage teaser via `src/components/WorkCard.astro`. Every card links to the real repository; an empty array renders a "Coming soon" note.
- Resume content (experience timeline including internships, community, education history) lives in the `resume` object in `src/data/site.ts`, with extra detail drawn from your full CV. The Resume nav tab links out to your live resume website (`resumeSite` in site data).
- Change the Dracula-inspired colors in `src/styles/global.css` and the icon in `public/favicon.svg`.
- Home, Work, Posts, Timeline, and Contact are real pages, plus an external Resume tab linking to your live resume website. The resume button opens the browser print dialog; choose Save as PDF.
- The profile, work history, contact links, and posts are filled in with your real content, kept concise.

## Cloudflare Pages

Connect your GitHub repository (private repositories work) to Cloudflare Pages:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment: `NODE_VERSION` | `22` |
| Environment: `SITE_URL` | `https://your-project.pages.dev` |

Set `SITE_URL` to the actual production address so canonical links are correct. No Cloudflare adapter is needed for this static site. Git pushes trigger new deployments once connected.

Cloudflare Email Routing can forward incoming mail for a custom domain you own. It does not provide an email address at your `pages.dev` subdomain, a free `.dev` domain, or an outbound mailbox. A normal email address works with this site's `mailto:` contact link.

## Verify

```sh
npm run build
npx playwright install chromium
npm test
```

Browser tests run against the static preview server, so build first.

Browser tests cover routing, responsive overflow, theme persistence, Markdown articles, placeholder links, and the resume print action.
