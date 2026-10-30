# Nuxt sign-up demo

A frontend demo of a client-side rendered sign-up
application using Nuxt, Vue, TypeScript, and the Nord Design System.

Registration is simulated locally; no account is created.

## Project documents

- [Requirements and acceptance criteria](docs/spec.md)
- [Implementation milestones](docs/milestones.md)
- [Decision log](docs/decisions.md)

## Current status

Milestone 2 integrates Nord styles and Web Components. The page displays
“Sign up”, an Email input, and a “Create account” submit button. Native submission
is prevented; account creation and navigation are not implemented yet. The full sign-up form
comes in later milestones.

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

## Type checking and production build

```sh
npm run typecheck
npm run build
npm run preview
```

Run type checking separately from the build. `preview` serves the production
build locally; output is in `.output/`. No automated test suite is included yet.
