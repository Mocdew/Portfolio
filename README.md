# Olumide Erinfolami — Portfolio

Personal portfolio: machine learning projects for fintech, a "why hire me" page and a résumé download.

Built with SvelteKit 2 (Svelte 5), TypeScript and Tailwind CSS v4. Every page is prerendered to static HTML with `@sveltejs/adapter-static` and hosted on Vercel.

## Editing content

| What | Where |
| --- | --- |
| Project cards | `src/lib/data/projects.ts` |
| Name, links, email, skills, experience | `src/lib/data/site.ts` |
| Home page layout and copy | `src/routes/+page.svelte` |
| Why hire me page | `src/routes/why-hire-me/+page.svelte` |
| Résumé PDF | `static/Olumide_Erinfolami_Resume.pdf` |

The résumé in `static/` is public. It is a copy of the master résumé with the phone number removed — check any replacement for private details before committing it.

## Development

Requires Node.js 22+ and pnpm.

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # static site in ./build
pnpm preview      # serve the production build
```

## Checks

```sh
pnpm lint         # prettier + eslint
pnpm check        # svelte-check (types)
pnpm test:unit -- --run
pnpm exec playwright test   # end-to-end; set PW_CHANNEL=msedge to use the installed Edge
```

## Deployment

Pushing to `main` deploys to production on Vercel; other branches get preview URLs. The Vercel project uses the SvelteKit preset with default settings.
