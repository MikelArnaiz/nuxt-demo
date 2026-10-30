# Nuxt sign-up demo

A frontend demo of a client-side rendered sign-up
application using Nuxt, Vue, TypeScript, and the Nord Design System.

Registration is simulated locally; no account is created.

## Project documents

- [Requirements and acceptance criteria](docs/spec.md)
- [Implementation milestones](docs/milestones.md)
- [Decision log](docs/decisions.md)

## Current status

Milestone 6 adds the `/success` route after valid submission and a return link
to a fresh sign-up form. Both routes share layout and typography, have meaningful
page titles, and announce title changes through a visually hidden polite live
region without moving focus to headings. Direct success visits and refreshes
show the same generic confirmation; no authentication is implied.

The form validates on submission, then updates errors as fields change.
Nord inputs display associated required/format errors, and invalid submission
focuses the first invalid field. Email uses browser email-format rules after
ignoring surrounding whitespace; passwords need only be nonempty and are never
trimmed. Password visibility and the optional product-updates checkbox remain
connected to local state.

The white page uses a centered heading and a responsive 470px content column,
without a header or form card. Native submission is prevented. Values stay in
component memory and reset on reload or when leaving the form, including when
returning through browser history. No account is created.

## Setup and development

Use Node.js 24.15.0 or newer within the Node 24 release line and npm.
With nvm installed, run these commands from this directory:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the local URL printed by Nuxt (normally http://localhost:3000).

## Tests, type checking, and production build

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

`npm test` runs focused validation tests using Node's built-in test runner and
TypeScript support, with no additional test dependency. These test message
selection and password rules; browser email semantics and real Nord interactions
were checked manually. A permanent browser suite follows in milestone 7.

Run type checking separately from the build. `preview` serves the production
build locally; output is in `.output/`.

## Direct routes and hosting

The Nuxt production server used by `npm run preview` handles direct requests to
both `/` and `/success`. For a Node deployment, run `node .output/server/index.mjs`
after building.

For static hosting, run `npx nuxt generate` and deploy `.output/public/`. Configure
the host's SPA fallback/rewrite to serve the generated `index.html` (or `200.html`
where supported) for application routes such as `/success`, preserving the
requested URL. Keep asset requests served normally. Without this fallback, a
direct visit or refresh can return a host-level 404 even when client navigation
works. Copying only the public assets from `npm run build` is not a static SPA
deployment. See [Nuxt deployment guidance](https://nuxt.com/docs/4.x/getting-started/deployment).
