# Web E2E Tests

This package runs the shared Playwright suite against the four web frontends:

- `web-nuxt`
- `web-solidstart`
- `web-svelte`
- `web-tanstack-react`

The test target builds the applications first, starts their production server
outputs on separate ports, and prepares the local PostgreSQL database with
migrations and seed data.

Run the full suite with:

```sh
pnpm nx run web-e2e:test
```

Install Chromium and Firefox once when setting up a new environment:

```sh
pnpm --filter web-e2e exec playwright install chromium firefox
```

Run an individual frontend project with:

```sh
pnpm --filter web-e2e exec playwright test --project=web-svelte
```

Firefox projects use names such as `web-svelte-firefox`. Playwright's bundled
Firefox is used so the suite tracks the latest version supported by the pinned
Playwright release.

PostgreSQL must be available at the default `DATABASE_URL`, unless a different
connection is supplied through the environment.

The Nuxt endpoint and detail tests run against the production output. Its
homepage gallery tests are currently skipped because the Nuxt production SPA
does not hydrate that route reliably with the current framework version.
