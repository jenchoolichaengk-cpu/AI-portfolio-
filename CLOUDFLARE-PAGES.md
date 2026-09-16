# Portfolio AI / Cloudflare Pages

This is a Next.js static export, not a Vite project. The existing interface, interactions, and mock AI data do not require a backend, database, Pages Functions, or a Worker adapter.

## Git-connected Pages settings

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Root directory | The repository directory containing package.json |
| Build command | npm run build |
| Build output directory | out |
| Node.js | 24, selected by the committed .nvmrc |
| Build variable | PNPM_VERSION=10.11.0 |
| Application secrets | None |

Set PNPM_VERSION for both Production and Preview builds. It is a build-tool version, not an API key. Keep pnpm-lock.yaml in Git: Pages installs the dependencies with pnpm, then npm runs the existing build script (`next build`). Do not introduce a second package-lock.json just to run an npm script. Leave automatic dependency installation enabled.

Cloudflare's v3 build system does not select Node.js from package.json engines and does not infer the pnpm version from the lockfile version. The .nvmrc and PNPM_VERSION setting make these choices explicit. If a dashboard NODE_VERSION override exists, keep it consistent with Node 24.

## What is deployed

`next.config.ts` already sets `output: 'export'` and disables server-dependent image optimization. `npm run build` produces out/index.html, out/404.html, out/_next/, and the files from public/. The existing /kitchen.png and /favicon.svg references are correct at the deployed domain root.

The workflow screens are React state views within the root page; they are not /diagnosis or /portfolio URL routes. Refreshing returns to Home while browser-local draft data remains. Keep this behavior unchanged: no SPA catch-all rewrite or Functions router is required.

Pages ignores vercel.json. Keep it for optional Vercel deployment; it does not control Pages installation or builds. The old .openai hosting metadata is also unrelated and is now excluded from Git. Do not upload the project root as static content: deploy only out/. The standalone outputs/portfolio-ai/index.html is a separate offline artifact.

## GitHub and secrets

The deployment check found no API-key literals, private keys, credential-bearing URLs, or sensitive environment files in the inspected first-party source/configuration files. The local repository had no commit history to inspect. This is a scoped pattern scan, not a guarantee against every possible secret format.

The ignore rules exclude .env files, .dev.vars files, .wrangler state, old Sites metadata, dependency folders, build output, and local scratch files. Keep actual API keys out of source and public/ if real AI is added later; NEXT_PUBLIC_ variables are visible to browsers. No such variables are needed now.

## Validation and limits

Build and browser verification are local; this check does not create or publish a Cloudflare project. After deploying, open the production pages.dev URL in a signed-out browser and check the full sample workflow. Disable Cloudflare Access for that production site if unrestricted public access is intended.

Uploads remain browser-side file metadata only. AI replies and analysis remain simulated. Drafts are localStorage data on the current browser and origin, with no cross-device synchronization.

## Official references

- https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- https://developers.cloudflare.com/pages/configuration/build-image/
