# Nuxt sign-up demo

A frontend demo of a client-side rendered sign-up
application using Nuxt, Vue, TypeScript, and the Nord Design System.

Registration is simulated locally. Valid input navigates to `/success`; no
account is created, no registration request is sent, and the product-updates
choice is not saved. No backend, API keys, or environment variables are needed.

## Project documents

- [Requirements and acceptance criteria](docs/spec.md)
- [Implementation milestones](docs/milestones.md)
- [Decision log](docs/decisions.md)
- [Vue/Nuxt learning notes and end-to-end walkthrough](docs/vue-nuxt-learning-notes.md)

## Behavior, assumptions, and trade-offs

The `/success` route follows valid submission and has a return link
to a fresh sign-up form. Both routes share layout and typography, have meaningful
page titles, and announce title changes through a visually hidden polite live
region without moving focus to headings. Direct success visits and refreshes
show the same generic confirmation; no authentication is implied.

The form validates on submission, then updates errors as fields change.
Nord inputs display associated required/format errors, and invalid submission
focuses the first invalid field. Email uses browser email-format rules after
ignoring surrounding whitespace; passwords need only be nonempty and are never
trimmed. Password visibility and the optional product-updates checkbox remain
connected to local state. `person@localhost` is accepted; no deliverability or
dotted-domain rule is added. Even a whitespace-only password is accepted because
this demo imposes no password-strength policy. The optional product-updates
choice does not affect validity.

Both white pages vertically center the heading and content in a responsive
470px content column, with scrolling on short screens and no header or form card.
Email has an example placeholder; the password visibility icon button sits inside
the input and has a changing accessible action name and tooltip. Native submission
is prevented. Values stay in component memory and reset on reload or when leaving
the form, including when
returning through browser history. `ssr: false` makes this a JavaScript-dependent
SPA. Nord supplies the real controls, tokens, and supported accessibility APIs;
its styling takes precedence over exact reproduction of the careers reference.
The two eye icons are bundled locally, avoiding runtime CDN requests.

Authentication sessions, backend registration, email verification, password
confirmation/strength rules, social login, global state, and artificial loading
states are outside this assignment.

## Setup and development

Use Git, npm, and **Node.js 24.15.0 or newer within the Node 24 release line**.
`.nvmrc` selects Node 24; nvm is optional if a compatible Node is already installed.
The submission was verified with Node 24.22.2 and npm 11.8.0.

```sh
git clone https://github.com/MikelArnaiz/nuxt-demo.git
cd nuxt-demo
nvm install
nvm use
npm ci
npm run dev
```

If already checked out, start with `nvm install` from the repository directory.
Open the local URL printed by Nuxt (normally <http://localhost:3000>).
Stop the development server with Ctrl+C.

## Linting, formatting, and pre-commit checks

```sh
npm run lint
npm run format:check
```

`lint` checks Vue, JavaScript, and TypeScript in the application, configuration,
and tests using Nuxt's project-aware ESLint configuration. It fails on errors or
warnings and does not apply fixes. Prettier owns formatting; overlapping ESLint
formatting rules are disabled. Type checking remains a separate command.

`format:check` reports formatting differences without writing files. `format`
formats all supported files throughout the repository, including source,
configuration, and documentation. Both tools ignore generated Nuxt/build output,
dependencies, caches, coverage, and Playwright artifacts. Prettier also ignores
the npm-generated lockfile and generated Husky helpers. The initial repository
formatting pass is complete, and `format:check` passes.

`npm ci` runs `nuxt prepare` to generate Nuxt's types and ESLint configuration,
then `husky` to install the local Git hooks. If dependencies were installed with
lifecycle scripts disabled, run `npm run postinstall` and `npm run prepare`
explicitly. Husky sets this repository's `core.hooksPath` to `.husky/_`, which
takes precedence over any global hooks path without changing the global setting.
Git needs Node/npm available in its environment, including when committing from
a GUI; see [Husky's version-manager guidance](https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis).

Before a commit, lint-staged reads `.lintstagedrc.json`, checks staged code with
ESLint, then formats it with Prettier; supported staged documents and styles are
formatted too. The patterns do not overlap, and no semantic autofixes, type checks,
builds, or browser tests run in the hook. lint-staged's default backup, rollback, and hiding of
unstaged portions of partially staged files remain enabled. Successful formatting
is staged automatically; a lint failure blocks the commit and restores task
changes. Review formatting changes before retrying a commit.

Hooks are local convenience checks and can be bypassed, for example with
`HUSKY=0 git commit ...`. Run the standalone checks when reviewing changes;
no GitHub Actions workflow is planned.

## Tests, type checking, and production build

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

`npm test` runs focused validation tests. `npm run typecheck` checks the Nuxt
application and browser-test TypeScript separately from the build.
`npm run preview` serves the production build from `.output/`.

Playwright runs eight behavior tests and three accessibility scans per browser
using actual Nord components (22 cases across Chromium and WebKit):

```sh
npx playwright install chromium webkit
npm run test:browser

# Run a single browser:
npm run test:browser -- --project=chromium
npm run test:browser -- --project=webkit

# Open the latest HTML report:
npx playwright show-report
```

The browser suite builds the app, starts a production server on
`http://127.0.0.1:4173`, and stops it afterward. Keep port 4173 free; the suite
can run alongside development on port 3000.

Coverage includes validation, keyboard interaction and focus, password visibility,
navigation, fresh form state, and responsive layout. Accessibility scans check
WCAG 2.1 A/AA rules on the initial form, the form with required errors, and the
success page. Reports include full axe results for review.

Failure screenshots and traces are saved in `test-results/`; the HTML report is
in `playwright-report/`. Use disposable values because traces can contain input.

For a complete check, run `npm run lint`, `npm run format:check`, `npm test`,
`npm run typecheck`, and `npm run test:browser`. The browser command includes a
fresh production build.

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
