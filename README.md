# Portfolio AI

An interactive, frontend-only portfolio copilot prototype. Built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style Radix primitives, Lucide, Framer Motion, and Recharts.

## Run

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. To generate a portable static website, run `pnpm build`; the output is in `out/`. Serve that folder over HTTP rather than opening an HTML file directly.

Use Node.js 24.x and pnpm 10.11.0. After building, `pnpm start` serves the exported website locally; pass `--port 3002` to use another port. See [DEPLOYMENT.md](DEPLOYMENT.md) for the Vercel settings and public-access checklist. No backend or AI credentials are required.

For Cloudflare Pages, see [CLOUDFLARE-PAGES.md](CLOUDFLARE-PAGES.md). Use the Next.js (Static HTML Export) preset, `npm run build`, output directory `out`, and build variable `PNPM_VERSION=10.11.0`. The committed `.nvmrc` selects Node.js 24.

## Interview walkthrough

1. Create a portfolio project from Home.
2. Choose **Use demo project** to load nine sample materials.
3. Analyze the project, compare career matches, and select a role.
4. Inspect all seven diagnosis dimensions. Expand priority gaps, ask the contextual copilot, and add recommendations to the improvement plan.
5. Build the portfolio story. Edit section titles and text, reorder sections, and inspect linked sample materials.
6. Preview desktop/mobile layouts and export the draft as Markdown.

## Prototype boundaries

- There is no backend, authentication, or actual AI inference.
- Uploads track file metadata locally; file contents are not parsed or transmitted. Every analysis uses the clearly labeled Smart Kitchen Companion sample.
- Copilot responses use topic-based mock replies grounded in the project. Arbitrary questions receive a contextual fallback.
- Scores are illustrative, not hiring probabilities. Readiness is a supplied holistic mock value, not the average of dimension scores.
- The name, story edits, and improvement plan persist in browser local storage. Files and chat remain session-only. Profile edits last for the current session.
- New project creation replaces the current demo project. This prototype demonstrates one project workflow.
- Export produces an editable Markdown draft, not a PDF or hosted portfolio.
- Optional WebMCP registration is feature-detected. Normal browsers do not require it.

## Asset

`public/kitchen.png` is a generated fictional product concept, created with the built-in image generation tool. Prompt: a sharp, bright, photorealistic industrial design render of a compact matte gray countertop recipe assistant with a tilted touchscreen and tactile dial, on a neutral kitchen counter, with no branding or overlaid text. It is not evidence of a manufactured or tested product.

## Verification

The local end-to-end walkthrough covers creation, demo asset loading, simulated analysis, career selection, diagnosis dimensions, contextual chat, planning, editing, export, browser draft restoration, and desktop/mobile overflow. Visual captures are in `outputs/` and the local verification scripts are in `work/` (both excluded from published source).
