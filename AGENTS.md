# AGENTS.md

## Cursor Cloud specific instructions

This is a single, static, front-end-only **Astro** site (personal portfolio + UI component showcase). There is no backend, database, or auxiliary service — the dev server is the whole product. Package manager is **npm** (`package-lock.json`), Node `>=22.12.0`.

Standard commands are documented in `README.md` / `package.json` (`npm run dev`, `npm run build`, `npm run preview`). Notes not obvious from those:

- **Dev server:** `npm run dev` serves at `http://localhost:4321`. It binds only to localhost; pass `--host` if you need it exposed on the network.
- **Routes:** pages live in `src/pages/*.astro` and map to routes by filename: `/`, `/components`, `/styles`, `/basic-layouts`, `/inspired-layouts`, `/work`.
- **Lint/type-check:** there is no lint script, and `astro check` is NOT usable out of the box — it requires the optional `@astrojs/check` + `typescript` packages that are not in `dependencies`, so `npx astro check` will hang on an interactive install prompt. Use `npm run build` (which runs `astro build` and validates all pages) as the correctness gate instead.
- **Build:** `npm run build` outputs static HTML to `dist/` (gitignored).
