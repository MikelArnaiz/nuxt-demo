# Nuxt sign-up demo

A client-side sign-up demo built with Nuxt, Vue, TypeScript, and the Nord Design
System. Registration is simulated: valid input
navigates to `/success`; no account is created or registration request sent.
No backend, API keys, or environment variables are needed.

## Features

- Nuxt and TypeScript with client-side rendering.
- Nord Design System components following its [Vue integration guidance](https://nordhealth.design/docs/developer/web-components/#vue).
- Required email and password fields with validation messages.
- Password visibility toggle and an optional product-updates checkbox.
- A success page after simulated sign-up.

See [Implementation decisions](docs/decisions.md) for the rationale behind the
demo's behavior and technical choices.

## Run locally

Use Git, npm, and **Node.js 24.15.0 or newer within Node 24**. `.nvmrc` selects
Node 24; nvm is optional when a compatible Node is already installed.

```sh
git clone https://github.com/MikelArnaiz/nuxt-demo.git
cd nuxt-demo
nvm install
nvm use
npm ci
npm run dev
```

For an existing checkout, start with `nvm install`. Open the URL printed by Nuxt
(normally <http://localhost:3000>); stop the server with Ctrl+C.

## Demo behavior

- The form starts empty, with the password hidden, opt-in unchecked, and no errors.
  Submission shows errors and focuses the first invalid field; later edits update
  errors. Password visibility preserves the value and works by keyboard or pointer.
- Email follows browser format rules after ignoring surrounding whitespace.
  Passwords must only be nonempty and are never trimmed; whitespace-only passwords are accepted.
  Either opt-in choice is valid.
- Valid submission opens a generic `/success` page. Direct visits and refreshes
  work too. Returning to sign-up through its link or browser history starts fresh.
- Form values stay in page memory: application code never persists, transmits,
  or logs them. The product-updates choice is not saved. Both routes require
  JavaScript because server-side rendering is disabled.

Both pages share a responsive, centered layout using Nord controls and tokens.
They have meaningful titles and announce route changes without moving focus to
headings. Authentication, email verification, password-strength rules, social
login, and backend integration are outside the demo's scope.

## Checks

```sh
npm run lint
npm run format:check
npm test
npm run typecheck
npx playwright install chromium webkit
npm run test:browser
```

The browser command builds production output, serves it on `127.0.0.1:4173`, and
stops it afterward; keep that port free. To run one browser, append
`-- --project=chromium` or `-- --project=webkit`. Open the HTML report with
`npx playwright show-report`. Failure traces and screenshots are in `test-results/`;
use disposable input because traces can contain it.

`npm run format` applies Prettier formatting. `npm ci` also generates Nuxt types
and ESLint configuration and installs Husky. If installation scripts were disabled,
run `npm run postinstall` and `npm run prepare`. The pre-commit hook lints staged
code and formats supported staged files, preserving unrelated unstaged edits.
Full type, build, and browser checks run separately. Git GUIs need Node/npm
available in their environment; hooks are local convenience checks.

## Verification and known limitations

Recorded on 2026-11-01 with Node 24.22.2 and npm 11.8.0:

- Lint, formatting, four validation unit tests, application/test type checks, and
  all 22 production browser cases passed. The browser suite covers eight behaviors
  and three axe scan states per browser in Chromium and WebKit using real Nord controls.
- Coverage includes validation, keyboard/focus, password visibility, navigation,
  fresh state, privacy checks, and narrow/short-screen layout. All six axe scans
  found zero selected WCAG 2.1 A/AA violations on the initial form, required-error
  form, and success page, with no element exclusions or disabled rules.
- A disposable clone verified `npm ci`, hook behavior, development/production
  serving, and static generation using cached packages and browser binaries.
- The Pages build was checked under `/nuxt-demo/` using a plain static server
  without an SPA fallback in Chromium and WebKit. Assets, validation, password
  visibility, sign-up navigation, direct success visits, refreshes, and the return
  link passed; all requested bundled assets returned HTTP 200.
- The author completed visual, keyboard, actual 200%/400% browser zoom, and
  VoiceOver checks. Manual primary-button contrast was reported as 6.17:1
  for white text on `#3559C7`; axe left this check inconclusive because of Nord's
  pseudo-element background.

In Safari/VoiceOver, specific errors are spoken on submission but are not repeated
when returning to invalid fields; labels, required state, and generic invalid state
are announced. This is an accepted demo limitation; see the
[accessibility decision](docs/decisions.md#7-accept-the-observed-voiceover-limitation).
Automated scans and bundled WebKit coverage do not establish full accessibility
conformance or replace Safari/VoiceOver testing.

## Production and hosting

Run `npm run build`, then `npm run preview` to inspect production output locally.
For a Node deployment, start `node .output/server/index.mjs` after building;
the server handles direct requests to both routes.

For static hosting, run `npm run generate` and deploy `.output/public/`.
Both `/` and `/success` have generated entry files, so direct visits and refreshes
work without a host-specific SPA rewrite. The success URL may gain a trailing
slash when a static host serves `success/index.html`. Both pages still render
in the browser and require JavaScript.

### GitHub Pages

The demo is deployed to [GitHub Pages](https://mikelarnaiz.github.io/nuxt-demo/)
through the [Pages workflow](.github/workflows/pages.yml), which runs checks and
publishes on pushes to `main`.
