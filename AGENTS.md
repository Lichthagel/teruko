# AGENTS.md

pnpm + Vite+ monorepo. Package manager and runtime versions are pinned in `package.json`; never use npm or yarn. `.npmrc` sets `shamefully-hoist=true` and `auto-install-peers=true` — rely on this, don't "fix" hoisting issues.

## Commands

- Install: `pnpm install` (run after any change to `pnpm-workspace.yaml` or deps).
- Build everything: `pnpm run build` (`vp run -r build`; follows workspace dependency order).
- Run a package task: `pnpm exec vp run --filter <project> <task>` (e.g. `pnpm exec vp run --filter web-svelte build`).
  - Project names are the package `name` fields in each `apps/*` / `packages/*` `package.json`.
- Lint (root, whole repo): `pnpm run lint` → Vite+ Oxlint. Package scripts are available with `pnpm exec vp run -r lint`.
- E2E tests: `pnpm --filter web-e2e run test`; checks: `pnpm --filter web-e2e run check`. E2E requires PostgreSQL and automatically migrates and seeds the database.

## CI / pre-commit

- `.github/workflows/ci.yml` runs exactly `pnpm install` → `pnpm run build` → `pnpm run lint`. Match this order locally.
- Pre-commit runs `lint-staged` (Vite+ lint with `--max-warnings=0`) over staged files. Keep commits lint-clean.

## Structure

- `apps/` — 5 web frontends, each a different framework: `web-nuxt` (Nuxt), `web-solidstart` (SolidStart), `web-svelte` (SvelteKit), `web-tanstack-react` (TanStack Start/React), `userscript` (Vite + `vite-plugin-monkey`, browser userscript). The first four all consume the shared GraphQL layer.
- `tests/web-e2e/` — shared Playwright suite for the four `web-*` applications.
- `packages/` — shared libs: `server-graphql` (Pothos + graphql-yoga schema), `server-db` (Drizzle ORM), `server-env` (env loading), `models`, `services` (bsky/pixiv integrations), `client-graphql`, `client-css`, `tsconfig` (shared base configs).

## Framework / toolchain quirks

- Vite+ uses Oxlint for linting. Preserve the configured double quotes and semicolons when editing; the prior ESLint configuration was migrated.
- `web-tanstack-react` uses `@tanstack/router-plugin`: `src/routeTree.gen.ts` is **generated** — do not edit it by hand; regenerate via the app's build/dev (`pnpm exec vp -C apps/web-tanstack-react build` or its dev server).
- `userscript` build is `tsc && vite build` (no framework dev server). Uses `vite-plugin-monkey` for building the userscript.
- `server-graphql` marks `./dist/schema/**` as side-effects and uses `#lib/*` / `#schema/*` subpath imports — keep the `dist` build outputs intact.

## Env / runtime prerequisites

- Server packages (`server-env`, `server-db`, `server-graphql`) call `dotenv` loading `../../.env` from repo root and require **PostgreSQL**. The devcontainer (`.devcontainer/`) spins up a `postgres:latest` service (`postgres`/`postgres`/`postgres`). Without it, server-side code has no DB.
- Default `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5432/postgres`. `IMG_FOLDER` defaults to `./data`. `.env` is gitignored.
- `server-db` uses Drizzle; migrations live in `packages/server-db/drizzle/` (via `drizzle.config.ts`). Use `drizzle-kit` for schema/migration changes.
- `graphql.config.yml` points at `localhost:3000/graphql` and `localhost:5173/graphql` — run a dev server before using GraphQL tooling.

## Per-project config notes

- Vite+ task runner executes workspace scripts with dependency ordering (`vp run -r build`) and caches task definitions in root `vite.config.ts`.
- `pnpm-workspace.yaml` uses a centralized `catalog` (version pins live there, not in per-package `package.json`). Add/change a dependency version in the catalog, not in individual packages. `catalogMode: manual` — unused catalog entries are cleaned up automatically.
