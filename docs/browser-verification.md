# Browser verification

Milestone 7, 2026-10-30. Automated verification uses Node 24.22.2,
Playwright 1.64.1, its bundled Chromium 156, and the production Nuxt server.
The suite does not stub Nord controls, replace browser email validation, or
intercept navigation. No application changes were needed during verification.

## Automated evidence

Run `npx playwright install chromium` once, then `npm run test:browser`.
The command builds fresh production output and owns a server on port 4173.
Ten browser tests cover:

- Initial state, required fields, autocomplete, and natural Tab order.
- Empty submission, error descriptions/invalid state, first-invalid-field
  focus, live correction, newly invalid values, preserved values, and reload reset.
- Whitespace-only and malformed email, surrounding whitespace, and accepted
  `person@localhost`; whitespace-only passwords remain valid.
- Password visibility via pointer, Enter, and Space without submission or value
  changes; keyboard opt-in toggling.
- Pointer/Enter success with opt-in off/on, titles, polite atomic live-region
  messages, return link, browser history, and fresh form state.
- Direct success visits and refreshes without automatic heading focus.
- Generic success content, no credential-bearing requests or console messages,
  and empty browser storage/cookies in the tested submission flows.
- Both routes at 1280px and 320px: centered heading, white page, 470px/272px
  content, full-width form inputs/action, and no horizontal overflow with errors.

All tests also check for production console warnings and uncaught errors.
Layout screenshots are saved under `test-results/`. Failure traces and
screenshots help investigate integration failures; only disposable sample
values are used. Eight focused validation tests, application/browser-test
type checking, and the production build also pass.

## Manual evidence

Inspected the production app in the in-app browser using actual keyboard and
pointer interaction, and compared both routes with the specified visual
direction and the [careers sign-in reference](https://careers.nordhealth.com/connect/login).

- Sign-up starts with a centered dark heading, left-aligned required labels,
  generous whitespace, full-width fields/blue action, and no header or form card.
  Success retains the same heading, spacing, white surface, and content column.
  Nord's supported control styling takes precedence over the reference's
  different controls and header.
- Tab reaches Email, Password, visibility, opt-in, and submit in order. Visible
  focus styling was inspected on inputs, the checkbox, and the return link.
- Keyboard empty submission focuses Email and shows readable associated errors.
  Keyboard valid submission using `person@localhost` reaches generic success.
  Success leaves the heading unfocused; Tab reaches the return link.
- Inspected the suite's desktop and 320px screenshots on both routes. Required
  errors and opt-in text wrap without clipped controls or horizontal scrolling;
  success text and its return link remain readable.

## Remaining manual checks

Actual browser zoom and screen-reader speech could not be verified here.
Native Chrome control was blocked by missing computer-use permission; the
in-app browser did not change zoom in response to the zoom shortcut. A narrow
viewport is useful reflow evidence, but does not establish actual zoom behavior.
Automated live-region assertions establish DOM behavior, not spoken output.

To finish the manual pass:

1. In a desktop browser, open `/` at 200% zoom and inspect both normal and
   invalid states. Complete the form, inspect `/success`, and use the return
   link. Check readability, scrolling, focus visibility, and reachable controls.
   Repeat at 400% (a 1280px window should reflow to approximately 320 CSS pixels).
2. With VoiceOver/Safari or NVDA/Chrome, read the labels/required state and
   submit an empty form. Confirm the focused field's error is announced. Correct
   the fields, submit, and confirm the polite success title is spoken without
   heading focus. Follow the return link and use Back/Forward, checking title
   announcements and a fresh form. Record browser, screen-reader version, and
   any repeated or missing speech.

Chromium is the automated baseline. Firefox/WebKit and actual assistive
technology have not been certified by this suite.

## Milestone 8 presentation verification — 2026-10-31

Using Node 24.22.2 and production output with real Nord components:

- Eight Chromium browser tests and four unit tests pass, together with application
  and browser-test type checking and the production build.
- Email exposes its example placeholder while remaining initially empty and
  visibly labelled. Tab order remains Email → Password → visibility → opt-in → submit.
- The inline visibility control exposes “Show password” / “Hide password” as its
  accessible name, renders exactly one locally bundled SVG eye icon, and opens
  a tooltip matching its action. Pointer, Enter, and Space preserve the value,
  avoid submission/initial validation, and retain keyboard access.
- Desktop 1440×900 screenshot: form width 470px, 264px above and below the
  heading/form group; input, icon button, and submit align correctly.
- Success 1440×900 screenshot: approximately 362px above and below the
  heading/content group, using the same shared layout as sign-up.
- Mobile 320×800 screenshot: form width 272px, approximately 205px above and below
  the initial group. Errors and wrapped checkbox text remain readable.
- Short 320×240 inspection and browser assertions: content grows beyond the
  viewport with page padding, heading and submit can scroll into view, and no
  horizontal overflow occurs. On success, the heading and return link remain
  reachable.
- Keyboard-focused screenshot shows Nord's focus border on the inline action.
  Production tests report no browser warnings/errors.

The earlier actual browser zoom and spoken screen-reader checks remain pending;
this milestone does not claim to complete them.
