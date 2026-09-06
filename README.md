# Portfolio

Personal portfolio — Astro static site with projects, blog, and about.

- Live: <https://akshataggarwal.is-a.dev>
- Cloudflare: <https://akshataggarwal.pages.dev>
- Contact: <mailto:contact@akshataggarwal.is-a.dev>

## Develop

Requires Node.js 22.12+.

```sh
npm install
npm run dev
```

## Build & deploy

```sh
npm run build
npm test
```

Deployed on Cloudflare Pages from GitHub; pushes deploy automatically. `SITE_URL` env sets the canonical address (defaults to the live domain).

## Content

- Posts: `src/content/posts/*.md`
- Projects: `src/content/projects/*.md`
- Shared profile/resume data: `src/data/site.ts`
