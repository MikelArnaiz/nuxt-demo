# Nuxt sign-up demo

A frontend demo of a client-side rendered sign-up
application using Nuxt, Vue, TypeScript, and the Nord Design System.

Registration is simulated locally; no account is created.

## Project documents

- [Requirements and acceptance criteria](docs/spec.md)
- [Implementation milestones](docs/milestones.md)
- [Decision log](docs/decisions.md)

## Current status

Milestone 5 adds validation on submission, then updates errors as fields change.
Nord inputs display associated required/format errors, and invalid submission
focuses the first invalid field. Email uses browser email-format rules after
ignoring surrounding whitespace; passwords need only be nonempty and are never
trimmed. Password visibility and the optional product-updates checkbox remain
connected to local state.

The white page uses a centered heading and a responsive 470px content column,
without a header or form card. Native submission is prevented. Values stay in
component memory and reset on reload. Valid submissions currently stay on the
form; success navigation follows in milestone 6. No account is created.

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
