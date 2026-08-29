# AGENTS.md

pnpm + Nx monorepo. Package manager is pinned in `package.json` (`pnpm@11.14.0`); never use npm or yarn. Node version is pinned in `.node-version` (24.18.0). `.npmrc` sets `shamefully-hoist=true` and `auto-install-peers=true` — rely on this, don't "fix" hoisting issues.

## Commands

- Install: `pnpm install` (run after any change to `pnpm-workspace.yaml` or deps).
- Build everything: `pnpm run build` (runs `nx run-many -t build`; respects project graph, builds deps first).
- Build/test one project: `pnpm nx run <project>:<target>` (e.g. `pnpm nx run web-svelte:build`, `:lint`, `:dev`, `:check`).
  - Project names are the package `name` fields in each `apps/*` / `packages/*` `package.json`.
- Lint (root, whole repo): `pnpm run lint` → `eslint `. Individual projects also expose `pnpm nx run <project>:lint`.
- No top-level `test` script — verify via `build` + `lint` + per-app typechecks. End-to-end tests live in `tests/web-e2e` and run with `pnpm nx run web-e2e:test`; they require PostgreSQL and automatically migrate and seed the database.

## CI / pre-commit

- `.github/workflows/ci.yml` runs exactly `pnpm install` → `pnpm run build` → `pnpm run lint`. Match this order locally.
- Pre-commit runs `lint-staged` (eslint with `--max-warnings=0`) over staged files. Keep commits lint-clean.

## Structure

- `apps/` — 5 web frontends, each a different framework: `web-nuxt` (Nuxt), `web-solidstart` (SolidStart), `web-svelte` (SvelteKit), `web-tanstack-react` (TanStack Start/React), `userscript` (Vite + `vite-plugin-monkey`, browser userscript). The first four all consume the shared GraphQL layer.
- `tests/web-e2e/` — shared Playwright suite for the four `web-*` applications.
- `packages/` — shared libs: `server-graphql` (Pothos + graphql-yoga schema), `server-db` (Drizzle ORM), `server-env` (env loading), `models`, `services` (bsky/pixiv integrations), `client-graphql`, `client-css`, `tsconfig` (shared base configs).

## Framework / toolchain quirks

- ESLint uses `@antfu/eslint-config` with **double quotes** and **semicolons** (override of antfu defaults) and `func-style: expression` + `consistent-type-definitions: type`. Don't reformat to single quotes. TypeScript rule `ts/no-redeclare` and `ts/no-use-before-define` are turned off.
- `web-tanstack-react` uses `@tanstack/router-plugin`: `src/routeTree.gen.ts` is **generated** — do not edit it by hand; regenerate via the app's build/dev (`pnpm nx run web-tanstack-react:build` or its dev server).
- `userscript` build is `tsc && vite build` (no framework dev server). Uses `vite-plugin-monkey` for building the userscript.
- `server-graphql` marks `./dist/schema/**` as side-effects and uses `#lib/*` / `#schema/*` subpath imports — keep the `dist` build outputs intact.

## Env / runtime prerequisites

- Server packages (`server-env`, `server-db`, `server-graphql`) call `dotenv` loading `../../.env` from repo root and require **PostgreSQL**. The devcontainer (`.devcontainer/`) spins up a `postgres:latest` service (`postgres`/`postgres`/`postgres`). Without it, server-side code has no DB.
- Default `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5432/postgres`. `IMG_FOLDER` defaults to `./data`. `.env` is gitignored.
- `server-db` uses Drizzle; migrations live in `packages/server-db/drizzle/` (via `drizzle.config.ts`). Use `drizzle-kit` for schema/migration changes.
- `graphql.config.yml` points at `localhost:3000/graphql` and `localhost:5173/graphql` — run a dev server before using GraphQL tooling.

## Per-project config notes

- Nx caches `build`/`lint`; `dev` and `clean` are uncached. `build` depends on `^build` (upstream deps built first), outputs to `{projectRoot}/dist`.
- `pnpm-workspace.yaml` uses a centralized `catalog` (version pins live there, not in per-package `package.json`). Add/change a dependency version in the catalog, not in individual packages. `catalogMode: manual` — unused catalog entries are cleaned up automatically.
