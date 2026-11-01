# Nuxt sign-up demo

A frontend demo of a client-side rendered sign-up
application using Nuxt, Vue, TypeScript, and the Nord Design System.

Registration is simulated locally; no account is created.

## Project documents

- [Requirements and acceptance criteria](docs/spec.md)
- [Implementation milestones](docs/milestones.md)
- [Decision log](docs/decisions.md)

## Current status

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
connected to local state.

Both white pages vertically center the heading and content in a responsive
470px content column, with scrolling on short screens and no header or form card.
Email has an example placeholder; the password visibility icon button sits inside
the input and has a changing accessible action name and tooltip. Native submission
is prevented. Values stay in component memory and reset on reload or when leaving
the form, including when
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
TypeScript support. These test message selection and password rules.

Playwright runs eight behavior tests and three accessibility scans per browser
using actual Nord components (22 cases across Chromium and WebKit):

```sh
npx playwright install chromium webkit
npm run test:browser
# Run just one browser project:
npm run test:browser -- --project=chromium
npm run test:browser -- --project=webkit
# Open the most recent local HTML report:
npx playwright show-report
```

The browser command builds the app, starts its production server at
`http://127.0.0.1:4173`, runs the selected browsers, and stops the server. Keep that port free;
it deliberately does not reuse a running development server. Each test has an
isolated browser context. Coverage includes validation and focus, password
visibility, keyboard controls, `person@localhost`, opt-in choices, route
announcements, fresh form state, direct success visits/refreshes, and 320px
overflow. On macOS WebKit, keyboard-order tests use native Option-Tab
(`Alt+Tab` in Playwright) to include buttons, checkboxes, and links when the
system's Keyboard navigation preference is off. They keep the same focus-order
assertions and do not change system preferences or force focus.
Failures retain screenshots and traces under `test-results/`; the HTML report
is written to `playwright-report/`. Both directories are ignored by Git.
Visual styling is checked manually rather than asserting exact CSS values.
Use disposable test values when debugging because traces can contain entered values.

The three `@axe-core/playwright` scans cover the initial form, both required
errors after empty submission, and success reached by valid submission. Each
waits for its rendered state, scans the whole document including Nord's open
shadow roots, and asserts no detected violations under `wcag2a`, `wcag2aa`,
`wcag21a`, and `wcag21aa` (WCAG 2.1 A/AA, including its 2.0 requirements).
No rules or elements are excluded. Each scan attaches full axe JSON to the HTML
report, including passes, violations, and incomplete results that need review;
failures also print rule IDs, affected nodes, failure summaries, and help URLs.

These automated rules complement the interaction tests; a passing scan does
not establish full WCAG conformance, actual zoom behavior, or screen-reader
speech. Playwright's bundled WebKit tests Safari's engine, not the Safari app
or VoiceOver. Actual Safari/assistive-technology checks remain manual. See
[Playwright's accessibility guidance](https://playwright.dev/docs/accessibility-testing)
and [browser guidance](https://playwright.dev/docs/browsers#webkit).

`npm run typecheck` checks both the Nuxt application and browser-test TypeScript.
See [browser verification notes](docs/browser-verification.md) for manual
evidence and outstanding zoom/screen-reader checks.

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
