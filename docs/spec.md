# Sign-up application specification

## Objective

Let a person enter an email and password, optionally choose product updates,
and reach a success page. Keep the implementation small, accessible, and easy
to explain and maintain.

This document describes observable behavior independently of framework APIs.
Implementation choices and their rationale belong in [the decision log](decisions.md).

## Assignment requirements

- Use Nuxt with client-side rendering only.
- Use TypeScript.
- Use the Nord Design System appropriately, following its Vue integration guidance.
- Include email and password fields, both required, with errors for missing values.
- Provide a way to make the password visible.
- Allow the user to choose occasional product updates and announcements.
- Present a success page after sign-up.

References:

- [Role description](https://careers.nordhealth.com/jobs/8571712-senior-frontend-engineer)
- [Nord Design System](https://nordhealth.design/)
- [Nord Web Components and Vue integration](https://nordhealth.design/docs/developer/web-components/#vue)

The remaining details are project decisions that make the assignment testable;
they are not additional requirements supplied by the employer.

## Routes and content

### Sign-up: `/`

- Heading: “Sign up”.
- Email input, visibly labelled “Email” and marked required, with placeholder
  “e.g. name@example.com”. The placeholder does not replace the visible label
  or populate the input's value.
- Password input, visibly labelled “Password” and marked required.
- Icon-only password visibility control inside the right edge of the password
  input, with accessible name and tooltip “Show password” or “Hide password”
  according to its current action.
- Optional checkbox: “Receive occasional product updates and announcements.”
- Submit button: “Create account”.

### Success: `/success`

- Heading: “You're signed up!”.
- Generic confirmation with no personal data.
- Link: “Back to sign up”, returning to a fresh form at `/`.

Direct visits and refreshes of `/success` display the same generic page. This
route does not establish or prove authentication. Returning to the form through
the link or browser history starts with fresh application state.

## Form state and rules

| Field or control | Initial state    | Rule                                                                     |
| ---------------- | ---------------- | ------------------------------------------------------------------------ |
| Email            | Empty            | Required; validate format after ignoring surrounding whitespace.         |
| Password         | Empty and hidden | Required; accept any nonempty value without trimming or transforming it. |
| Product updates  | Unchecked        | Optional; either value permits submission.                               |
| Submit button    | Enabled          | Remains enabled for invalid values so submission can explain errors.     |

Email format validation follows standard HTML email-input validity semantics,
without a custom restrictive regular expression or deliverability checks.
Examples: `person@example.com` and `person@localhost` are accepted; `person`,
`@example.com`, and `person@` are rejected. Single-label domains are accepted;
requiring a dotted domain would be an additional application rule. An empty
or whitespace-only email is missing.

No password-strength or minimum-length policy beyond nonempty input is imposed.
A whitespace-only password therefore counts as nonempty; this is a deliberate
consequence of not inventing a password policy.

## Validation and submission

1. Initially, display no validation errors.
2. On submission, validate both fields.
3. If invalid, show the relevant errors, preserve all values, remain on `/`, and
   focus the first invalid field in document order (email before password).
4. After the first submission attempt, revalidate fields as they change. Errors
   disappear when corrected and appear when a field becomes invalid again.
5. If valid, navigate to `/success` regardless of the product-updates choice.

| Condition       | Error text                   |
| --------------- | ---------------------------- |
| Email missing   | Enter your email address.    |
| Email malformed | Enter a valid email address. |
| Password empty  | Enter your password.         |

Enter in a form input submits through normal form behavior. Toggling password
visibility preserves the value and does not submit or validate the form.

## Visual direction

Use [Nordhealth's careers sign-in page](https://careers.nordhealth.com/connect/login)
as the visual reference for vertical centering, the centered heading, narrow form,
whitespace, and primary-action placement. Implement the form with Nord Design
System components and tokens, prioritizing their supported styling and accessible
behavior over exact reproduction of Teamtailor controls.

- Use a white page with generous whitespace and no enclosing form card.
- Start the page content with the heading; do not add a logo or header, or reserve
  empty space for the reference's header.
- Center a single content column, approximately 470 CSS pixels wide on desktop.
  Let it shrink on smaller screens with comfortable side padding.
- Vertically center each page's heading and content as one group within the viewport
  when space permits. Keep comfortable top and bottom padding; when content
  exceeds the available height, allow normal vertical scrolling so the heading,
  validation errors, and all controls remain reachable on short screens and at zoom.
- Center the primary heading above the form. Keep field labels left-aligned,
  required indicators visible, and inputs and the submit button full-width.
- Use Nord inputs, a Nord checkbox for product updates, and a Nord primary submit
  button. For password visibility, use a square custom Nord button in the password
  input's `end` slot, following
  [Nord's custom button example](https://nordhealth.design/components/input/#custom-button).
  Conditionally render `interface-edit-on` or `interface-edit-off` through
  `nord-icon` so only the icon for the current action is shown. Keep the button
  non-submitting (`type="button"`).
- Follow the reference's dark heading, blue primary action, and spacious rhythm
  using Nord typography, spacing, colors, and supported component sizes. Small
  visual differences from the reference are acceptable; use public styling APIs.
- Reuse the vertical centering, content width, typography, and spacing on `/success`.
- Keep the submit label “Create account”. The reference's social-login section,
  home shortcut, and account-switching link are not part of this demo.

## Accessibility and presentation

- Use Nord controls, public component APIs, and design tokens appropriately.
- Provide a responsive layout without horizontal scrolling at 320 CSS pixels
  wide, and verify usability on desktop and with browser zoom.
- Provide visible labels, required indicators, logical keyboard order, and
  visible focus. All interactions must work without a pointer.
- Associate errors with fields and expose invalid state to assistive technology.
- Make the visibility control's accessible name describe its current action.
- Use appropriate email and new-password autocomplete hints.
- Use meaningful page titles, a main landmark, and a primary heading per page.
- On client-side navigation, update the title and announce it through a visually
  hidden polite live region. Do not automatically focus headings on navigation,
  direct visits, or refreshes. Tab follows the natural control order.
- Verify actual Nord control behavior rather than assuming that the design
  system alone guarantees accessibility.

## Testing and code quality

- Run the Playwright browser suite against the production build in both Chromium
  and WebKit, using actual Nord components. WebKit provides coverage of Safari's
  engine; it is not the Safari application and does not replace real Safari or
  VoiceOver checks.
- Add accessibility scans through `@axe-core/playwright` for three rendered
  states in each browser: the initial sign-up form, the form after empty
  submission with both required errors visible, and the success page reached
  through valid submission. Require no detected violations under the selected
  WCAG 2.1 A/AA rules, and document the scan scope.
- Preserve interaction assertions for keyboard order, password visibility,
  first-invalid-field focus, error associations, and route announcements.
  Automated scans complement these tests; they do not establish full accessibility
  conformance or verify spoken screen-reader output. Retain manual zoom and
  screen-reader verification.
- Add ESLint for Vue/TypeScript code checks and Prettier for formatting, with
  compatible configurations and standalone `lint`, `format`, and `format:check`
  commands. Exclude generated output, dependencies, and test artifacts.
- Use Husky and lint-staged for a lightweight pre-commit hook: format supported
  staged files automatically and block commits on lint errors in staged code.
  Leave semantic fixes for review and preserve unrelated unstaged changes.
- Keep full type checking, builds, and browser tests outside the pre-commit hook;
  run them before delivery and after meaningful changes. Document hook setup and
  manual commands. GitHub Actions is outside this demo's scope.

## Data handling and scope

Form values belong to the sign-up screen and remain in memory only. Do not put
credentials in URLs, browser storage, analytics, or logs. Do not carry the
password into the success page.

Submission is a local demonstration: no request, artificial delay, loading
spinner, or actual account creation. The README must explain this limitation.

Out of scope: backend services, authentication sessions, email verification,
password confirmation, password-strength meters, social login, global state
management, and a custom component library.

## Acceptance checklist

- [ ] A fresh form has empty inputs, hidden password, unchecked opt-in, and no errors.
- [x] The empty email input shows “e.g. name@example.com” while retaining its visible Email label.
- [ ] Empty submission shows both required errors and focuses email.
- [ ] Whitespace-only email shows the required error.
- [ ] Malformed email prevents navigation and shows the format error.
- [x] `person@localhost` is accepted by email validation as a single-label domain.
- [ ] Surrounding email whitespace does not invalidate an otherwise valid address.
- [ ] Empty password prevents navigation; when email is valid, password receives focus.
- [ ] Invalid submission preserves email, password, and opt-in state.
- [ ] After submission, editing updates errors, including when a value becomes invalid again.
- [ ] Password visibility toggles by keyboard and pointer without clearing or submitting.
- [x] The password visibility button sits inside the input's right edge and switches its icon, accessible action name, and tooltip together.
- [ ] Enter submits the form.
- [ ] Valid submission reaches success with the opt-in both selected and unselected.
- [ ] Success direct visits and refreshes work without personal data or stored state.
- [ ] Returning to sign-up starts a fresh form.
- [ ] Keyboard order, focus visibility, labels, error associations, and route announcements work.
- [ ] Sign-up displays a centered “Sign up” heading on a white page without a header, logo, or form card.
- [ ] Both pages' headings and content are vertically centered together when space permits; short screens, validation errors, and zoom leave all content reachable by scrolling.
- [ ] Desktop content is approximately 470 CSS pixels wide, with left-aligned field labels and full-width inputs and submit button.
- [ ] Both routes use consistent typography, content width, and spacing, with Nord controls and tokens taking precedence over exact visual matching.
- [ ] Narrow-screen and zoom checks reveal no inaccessible content or horizontal overflow.
- [ ] Credentials are never persisted, transmitted, or logged by application code.
- [ ] Type checking, focused automated tests, and production build pass.
- [x] Existing browser scenarios and the three axe scan states pass in Chromium and WebKit.
- [x] Manual zoom and screen-reader checks are recorded separately from automated scan results.
- [ ] ESLint and Prettier checks pass through the documented standalone commands.
- [ ] Pre-commit formats staged files and blocks lint errors without changing unrelated unstaged work or running heavyweight checks.
- [ ] README documents setup, commands, assumptions, and the simulated registration.
