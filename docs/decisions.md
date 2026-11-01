# Decision log

Initial decisions recorded on 2026-10-30 from the agreed planning direction.
These may be revised as implementation provides evidence; record the reason.

## D1. Simulate registration locally

The assignment requests a client-side application and supplies no API contract.
A valid submission navigates directly to success. No fake latency or networking
layer is needed. A real integration would await backend confirmation and handle
pending and failure states before navigation.

## D2. Keep form state local and ephemeral

Only the sign-up screen needs the field values. Local state avoids unnecessary
global state and persistence, especially for passwords. Leaving the screen
discards its state; returning starts a fresh form.

## D3. Allow direct access to generic success content

The success route contains no personal data and grants no access. It may be
visited directly or refreshed. A guard or persisted registration flag would add
complexity without providing authentication or protecting any resource.

## D4. Add email format validation, but no invented password policy

Email format checking is a small usability addition beyond the brief. Follow
standard HTML email-input validity semantics and ignore surrounding whitespace.
Do not attempt to prove deliverability. Passwords remain unchanged and need only
be nonempty because no strength policy was supplied.

## D5. Validate on submission, then on changes

Avoid showing errors before the person tries to submit. After that attempt,
update validation as fields change so errors remain useful and current. Keep
submit enabled and focus the first invalid field when submission fails.

## D6. Start with minimal architecture

Use Nord's controls and tokens, local state, and straightforward validation.
Introduce shared components, composables, or dependencies only when a concrete
need appears. Framework and tooling versions selected during setup are recorded
in D9 and D10.

## D7. Verify behavior at the appropriate level

Use focused unit tests for meaningful validation logic and browser tests for
form interactions, navigation, and Nord integration. Supplement automation with
manual keyboard, accessibility, and responsive checks.

## D8. Adapt the careers sign-in layout using Nord components

Use [Nordhealth's careers sign-in page](https://careers.nordhealth.com/connect/login)
as a visual reference for the narrow content column, centered
heading, whitespace, and primary-action placement. Inspection on 2026-10-30
showed Teamtailor scripts and styles, native HTML form controls, and no `nord-*`
elements. This supports treating it as a form layout and styling reference rather than
an example of Nord Web Component integration.

Retain the assignment's Nord Design System requirement. Use Nord controls,
tokens, component sizes, and public styling APIs, accepting small differences
from Teamtailor's appearance. Avoid a custom component library or overrides of
component internals solely to reproduce the reference.

Use “Sign up” as the heading and retain “Create account” as the explicit submit
action. Add the password field, visibility control, and optional product-updates
checkbox required by this demo. Do not add the reference's logo or header, or
reserve space for them: the page content starts with the heading. Omit social
login, the home shortcut, and the account-switching link because those flows are
outside scope. Apply the same typography and layout to the generic success page.
Form behavior and data handling
remain as specified.

## D9. Minimal Nuxt 4 scaffold with explicit type checking

Milestone 1 uses Nuxt 4.6.3, Vue 3.5.44, TypeScript 5.9.3, and vue-tsc 3.3.14.
Pin direct dependencies and commit npm's lockfile for reproducible installation.
Use the established TypeScript 5 compiler with vue-tsc; upgrading the compiler
major version is not needed for this milestone. Node 24 (at least 24.15.0) meets
Nuxt's engine requirement; `.nvmrc` selects that release line. The machine's
default Node 25 is outside the supported range of this Nuxt release.

Scaffold the few required files directly to preserve the existing documents and
avoid starter features. Use Nuxt 4's `app/app.vue` entry point, `ssr: false`, and
generated TypeScript project references. Keep the heading in a plain setup
constant to demonstrate TypeScript and template bindings without adding state.
Disable the development toolbar so the page contains only the requested heading.
Run `nuxt typecheck` explicitly alongside the production build. No routing,
styling system, form logic, or test framework was needed for milestone 1.

## D10. Register Nord Web Components directly and load their Vue types

Milestone 2 pins `@nordhealth/components` 5.4.4 and `@nordhealth/css` 5.3.0.
Checked the current [Nord Vue integration guidance](https://nordhealth.design/docs/developer/web-components/#vue)
before setup. Use the Vue declarations shipped with components, rather than the
deprecated separate `@nordhealth/vue` package.

Import Input and Button in a Nuxt client plugin so their browser registration
runs before the app mounts. Recognize only `nord-*` tags as custom elements in
Nuxt's Vue compiler options; unrelated misspelled component names should still
produce normal Vue warnings. Import the supplied Vue declarations in
`app/types/nord.d.ts`, which Nuxt's app TypeScript project includes, rather than
editing generated configuration or replacing Nuxt's existing types.

Load CSS globally through `css: ['@nordhealth/css']`. Version 5.3.0 exports its
stylesheet at the package root; the older deep `lib/nord.min.css` import is
blocked by its exports map. Use Nord spacing tokens for the form's spacing.

Use sign-up terminology in this minimal integration: a `signup-form` class,
an “Email” input with `name="email"`, `type="email"`, and `autocomplete="email"`,
and a “Create account” button with `type="submit"`. Milestone 3 completes the
static sign-up form. No wrapper components or extra integration module are needed.

The form uses Vue's `@submit.prevent` modifier to prevent native submission from
reloading the page or putting the email in the URL. It does not create an
account or navigate yet. Reactive state, application validation, and success
navigation remain in their planned milestones. The email input currently keeps
its native format validation; validation ownership will be implemented explicitly
in milestone 5.

## D11. Compose the static page with standalone Nord controls

Milestone 3 keeps the form in `app/app.vue` and registers Checkbox alongside
Input and Button in the client plugin. The controls use their built-in labels
and required indicators. Email and password forward `email` and `new-password`
autocomplete hints to their native inputs. No additional hint copy or password
policy is specified, so none is invented.

Use Nord's public `expand` and large-size APIs for the inputs and primary
button. The secondary visibility button uses Nord's `default` variant and
explicit `type="button"` so it cannot submit the form. Place it below the
password input, aligned to the end, preserving full input width on mobile.
Its click behavior belongs to milestone 4.

Apply Nord's `n-reset` typography to the main landmark, a white surface token
to the body, and scoped layout styles using logical CSS properties and spacing
tokens. The main column allows 470px of content plus 24px padding on each side;
normal block sizing lets it shrink with the viewport. No fixed height, header
space, card, component-internal overrides, or layout dependency is needed.

Checked the official [Input](https://nordhealth.design/components/input/),
[Checkbox](https://nordhealth.design/components/checkbox/), and
[Button](https://nordhealth.design/components/button/) documentation on
2026-10-30, and confirmed the selected APIs in the installed 5.4.4 declarations.
The current documentation also describes newer Field composition; standalone
labels meet this form's needs without introducing another abstraction.

## D12. Bind Nord form properties and events explicitly

Milestone 4 uses local Vue `ref`s for email, password, product-updates opt-in,
and password visibility. Bind `value` with `input` for text fields, and `checked`
with `change` for the checkbox. Read these public properties from the event's
`currentTarget`, typed using Nord's shipped element declarations. The type-only
imports add no runtime registration; the client plugin still owns that.

These are Web Components, rather than Vue components implementing the
`modelValue` / `update:modelValue` convention. Native checkbox `v-model` also
selects its behavior from the native input type; a `nord-checkbox` tag does not
automatically get that native-checkbox behavior. Explicit bindings make both
directions clear without adding wrappers or a custom directive. Vue sets existing
custom-element properties through `v-bind`; registration already precedes mount.

Derive password input type and the button's action label with `computed` from
one visibility boolean. Change the existing input's type without remounting it
or modifying the password. Keep the button's explicit `type="button"`; changing
visibility neither submits nor invokes validation. Use the changing action name
“Show password” / “Hide password”, without adding toggle-state semantics to a
button whose label changes.

Wrap the changing button label in a stable `span`. Nord 5.4.4 adds a light-DOM
proxy button and Lit marker nodes inside the host for form participation.
Updating bare interpolation lets Vue replace the host's text content, removing
those nodes and causing Lit `ChildPart` errors. Updating only the span's text
preserves Nord's host children. Browser console checks exposed this issue even
though the label and visibility appeared to work.

Keep values unchanged in memory, with no trimming, logging, persistence, or
network requests. Validation and navigation remain in milestones 5 and 6.
Checked the official [Vue custom-element property guidance](https://vuejs.org/guide/extras/web-components.html#passing-dom-properties),
[Vue form bindings](https://vuejs.org/guide/essentials/forms.html), and installed
Nord 5.4.4 Input, Checkbox, and FormAssociatedMixin sources for their event and
property contracts on 2026-10-30.

## D13. Own validation messages while using browser email semantics

Milestone 5 adds `novalidate` to the form and handles `@submit.prevent` explicitly.
Application validation owns the specified timing and messages; native popovers
must not prevent the handler or compete with Nord errors. Keep `required` and
`type="email"` on Nord inputs for their visible markers, semantics, and input
behavior. Submit remains enabled.

One local `submitted` ref gates a computed validation array. Before submission it is
empty; afterward it derives results from current email/password values on each
edit. There is no separately synchronized error state or blur-based timing.
Password visibility and opt-in do not participate in validation.

Nord 5.4.4 does not expose native email validity through its public Input API.
Use one detached native `input` with `type="email"` to inspect `validity.typeMismatch`
for a trimmed copy of the email. It never enters the form or DOM. This preserves
browser email rules without a regex, validation dependency, native popover, or
application access to Nord's shadow DOM. The pure utility `getEmailError` receives
the email value and a boolean snapshot of `validity.typeMismatch` and selects the
required/format message. `getPasswordError` checks password length directly,
without trimming, strength rules, or transformation. Both return `null` for valid
values and have no knowledge of Vue, Nord, input refs, or form order.

The utility exports `SignupFieldName`, `SignupValidationResult`, and a pure
`validateSignup(values, emailTypeMismatch)` function that combines the field
validators into `{ name, error }` entries. Its documented validation priority is
email before password, matching the displayed form. The shared `SignupFieldName`
union constrains each entry's name and the keys in the component's `SignupErrors`.
A separate `Record<SignupFieldName, TemplateRef<NordInput>>` in the component maps names to input
refs and requires an entry for every known field name. A computed `SignupErrors`
lookup includes only fields with errors and supplies the template's named messages.
Unknown validation names, missing ref mappings, and misspelled error keys are
rejected by TypeScript.

Accept single-label domains such as `person@localhost`, as permitted by HTML
email-input validation. This also allows `foo@foo`: acceptance is based on
syntax, not a special allowance for localhost or proof that a mailbox exists.
A dotted-domain requirement is a reasonable additional product rule, but is
outside this demo's chosen validation policy. The `person@localhost` acceptance
case has a focused message-selection test and a real-browser check; the unit
test alone does not establish browser email syntax. `foo@foo` was also verified
in the real browser as an accepted consequence of this policy.

Bind each message through Nord's public `error` property. The installed component
conditionally exposes its built-in error alert, connects it with
`aria-describedby`, and marks its native input `aria-invalid`. Reusing this UI
avoids duplicate error markup or ARIA references across shadow roots.

Typed `useTemplateRef` references identify the email and password Nord inputs.
On invalid submission, find the first validation entry with an error and access
its input through `inputRefs[firstInvalidField.name].value`. This avoids a DOM
selector and keeps the focus helper and submit validity check generic. The
component owns the ref mapping; the field validators handle only values. Keep validation entries
in displayed form order. Await Vue's `nextTick`, then await
Nord's `updateComplete` before calling its public `focus()` method. These are
two rendering systems: Vue first assigns the properties, then Lit renders the
accessible error. Editing afterward updates errors without moving focus.

Use Node 24's built-in test runner and TypeScript stripping for eight focused
tests of message selection, required precedence, password whitespace, and
correction/regression. No new package is needed. Unit tests deliberately receive
the format result; they do not claim to implement or verify HTML email parsing.
Real-browser checks establish format semantics, event timing, focus, and Nord
error associations. The permanent browser suite stays in milestone 7.

Checked current [Nord Input guidance](https://nordhealth.design/components/input/),
installed Input/FieldControlMixin/FocusableMixin sources,
[Vue template refs](https://vuejs.org/guide/essentials/template-refs.html),
[Vue DOM timing](https://vuejs.org/api/general.html#nexttick),
[HTML email validity](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email),
and [Node TypeScript support](https://nodejs.org/api/typescript.html) on 2026-10-30.

## D14. Route pages own state; share presentation and announce route changes

Milestone 6 moves the form from `app/app.vue` into `app/pages/index.vue` and adds
`app/pages/success.vue`. The root renders `NuxtPage`, letting Nuxt generate `/`
and `/success` from the filenames. Await `navigateTo('/success')` only when the
current validation result has no errors. Navigate without a query string,
payload, request, guard, or registration flag; success is generic and directly
accessible as agreed in D1–D3.

Keep every form ref in the sign-up page. Do not enable KeepAlive or use a global
store: leaving the route unmounts the form, and returning through the link or
browser history creates fresh state. The success page never receives the email,
password, or opt-in.

Extract `app/components/PageContent.vue` now that two pages need the same main
landmark, heading, responsive width, and Nord typography/spacing. Its `heading`
prop also drives `useHead` for a consistent, meaningful document title. Use a
slot for route content and keep field layout in the form page. A separate Nuxt
layout layer is unnecessary for this small shared shell.

Before milestone 7, replace the original mount-time heading focus with a live
region at the user's request: automatic focus caused an intrusive heading
outline on both direct visits and route changes. Headings now have no template
ref, `tabindex`, focus hook, or focus-specific styling.

Mount one `NuxtRouteAnnouncer` in `app/app.vue`, alongside `NuxtPage`, so its
visually hidden live region persists across route changes. Use `politeness="polite"`
and `:atomic="true"` to announce the complete updated document title without
interrupting current speech or moving focus. The existing `useHead` titles
provide the messages, including “You're signed up!”. Nuxt's
built-in component avoids custom route watchers and announcement timing code.
Direct visits and refreshes do not automatically focus anything; the first Tab
reaches Email on sign-up or the return link on success. Keep Nord's normal
interactive focus indicators and the first-invalid-field focus on submission.

The production Nuxt server handles direct routes. Static deployment requires
generating SPA output and configuring a host fallback to its entry HTML; document
that requirement without adding an unchosen provider's configuration.

Checked Nuxt's official [routing](https://learn.nuxt.com/en/concepts/routing),
[head metadata](https://nuxt.com/docs/4.x/api/composables/use-head), and
[deployment guidance](https://nuxt.com/docs/4.x/getting-started/deployment), and
the installed Nuxt 4.6.3 page runtime. Verified actual production route changes,
titles, focus, fresh state, direct access, refreshes, and responsive layout in
the browser for the original milestone. The revised announcement behavior is
verified separately below. The permanent browser suite remains milestone 7.

The live-region implementation was checked against the installed Nuxt 4.6.3
`NuxtRouteAnnouncer` and `useRouteAnnouncer` sources, which update their message
after head metadata renders. See [Nuxt route announcer](https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer).

Reverified on 2026-10-30 using Node 24.22.2: all eight validation tests, type
checking, and production build passed. Development-browser checks with actual
Nord controls confirmed one `role="status"`, `aria-live="polite"`,
`aria-atomic="true"` region whose text follows titles on successful submission,
keyboard return navigation, and browser history. Direct visits and refreshes
left focus on the document; headings have no `tabindex` or visible outline.
Tab reached Email or the return link, and invalid submission still focused
Email. Live-region DOM updates were verified; spoken output with a screen
reader remains a manual milestone 7 check.

## D15. Test real Nord interactions against fresh production output

Milestone 7 pins `@playwright/test` 1.64.1 and uses its matching Chromium as
the small automated browser baseline. Four Node validation tests remain
focused on message selection and password rules. Eight browser tests cover the
integration between Vue events/reactivity, Nord's native controls, browser
email validity, and Nuxt navigation without replacing components or mocking
their behavior. This includes accepting `person@localhost`.

Playwright owns a production build/server on a dedicated loopback port (4173)
and refuses to reuse an existing server. This prevents a development instance
or stale build from silently supplying test evidence. Use two workers, isolated
browser contexts, no retries, and assertions that wait for observable DOM
state instead of fixed sleeps. Check production browser warnings and errors
in an automatic per-test fixture. Use accessible roles/names where possible;
the password input has no implicit textbox role, so scope its input selector
to its Nord host. Open shadow roots are traversed by Playwright's locators.
The app does not need test-only attributes, public methods, or wrapper components.

Keep `npm test` fast; `npm run test:browser` builds and runs the browser suite.
Use a separate TypeScript project for Playwright's Node-side configuration and
tests, included in `npm run typecheck`, rather than changing Nuxt's generated
application types. Ignore generated traces, reports, and screenshots in Git.
Retain failure screenshots and traces for diagnosis. Test values are disposable;
traces can include them and should not be recorded with real credentials.

Assertions for live-region text, roles, and focus establish browser DOM
behavior. They do not establish screen-reader speech or actual zoom behavior.
Record those manual limitations and completion steps in
[browser verification notes](browser-verification.md); leave the milestone's
manual check open until they are performed. No application fixes were required.

After critical review, reduced the original ten browser/eight unit tests to
eight browser/four unit tests. Run the full success/privacy/history flow once
with opt-in selected; the existing single-label-email/Enter case covers opt-in
off. Keep one narrow-screen overflow test and leave exact CSS values and desktop
appearance to visual review. Remove duplicate malformed-email examples and the
unit test claiming to verify reactivity by calling a stateless function repeatedly.
Single-label email acceptance and live error updates belong in the real browser;
unit tests cover error selection, password policy, and validation result order.
This reduces duplicate assertions and maintenance without combining unrelated
scenarios merely to lower the reported test count.

Checked official Playwright guidance for
[web-server ownership](https://playwright.dev/docs/test-webserver),
[shadow-DOM locators](https://playwright.dev/docs/locators#locate-in-shadow-dom),
and [browser projects](https://playwright.dev/docs/test-projects).

## D16. Inline password action, email example, and safe vertical centering

Milestone 8 uses the password input's public `end` slot for a square large Nord
button, matching the large input. The eye (`interface-edit-on`) means “Show
password”; the crossed-out eye (`interface-edit-off`) means “Hide password”. Vue
conditionally renders one icon inside a stable span, preserving Nord's light-DOM
proxy button and Lit markers. The input and action button remain mounted, and
`type="button"` keeps toggling out of submission and validation.

Use changing `nord-visually-hidden` text inside the stable span to name the
internal native button across Nord's shadow-DOM boundary. Browser role/name
queries verify the native control is named before and after toggling. Decorative
icons stay unnamed. A persistent Nord Tooltip, referenced by `aria-describedby`,
uses the same computed action text. Focus styling and tooltip behavior use Nord's
public APIs. See [Input custom button](https://nordhealth.design/components/input/#custom-button),
[Tooltip](https://nordhealth.design/components/tooltip/), and
[Visually Hidden](https://nordhealth.design/components/visually-hidden/).

Pin `@nordhealth/icons` 3.21.0 as a direct dependency, matching the version already
resolved through Nord. Bundle only the two SVG assets using Vite's `?raw` imports
and `NordIcon.registerIcon`, rather than fetching the icons from Nord's CDN at
runtime. The existing lockfile already contained that exact package; promoting
it to a direct dependency introduces no new resolved package or version.

Email gains the example placeholder “e.g. name@example.com”; its visible label,
empty initial value, autocomplete, and validation rules stay the same. Center
both pages through the shared PageContent layout. Flexbox with
`min-block-size: 100svh` centers each heading/content group and lets
the main element grow beyond the viewport. Existing padding protects the edges;
short screens and error text extend the document and remain scrollable. A fixed
height or absolute positioning would risk clipping content above the viewport.

Verified on 2026-10-31 with Node 24.22.2: four unit tests, eight production browser
tests, type checking, and build pass. Browser checks cover labels, tooltip,
rendered SVGs, pointer/Enter/Space toggling, preserved values, natural Tab order,
and short-screen reachability. Desktop/mobile screenshots confirm centering and
focus styling. Actual zoom and spoken screen-reader verification remain the
separate manual checks recorded in milestone 7.

## D17. Chromium/WebKit projects and scoped accessibility scans

Milestone 9 adds a `webkit` project using Playwright's `Desktop Safari` device
alongside the existing `chromium` project. Both run the same behavior suite and
three new scan cases against a fresh production build with actual Nord controls.
Keep the existing two workers, isolated contexts, zero retries, console checks,
and production-server ownership. The bundled WebKit engine is not the Safari
application and does not provide VoiceOver evidence.

Pin `@axe-core/playwright` 4.14.0; the lockfile resolves axe-core 4.14.0. Each scan
starts from a fresh form and waits for observable rendered controls. Empty
submission must show both required errors; valid submission must reach the
success route with its title, heading, return link, and route announcement.
Scan the entire document, including open shadow roots, with `wcag2a`, `wcag2aa`,
`wcag21a`, and `wcag21aa`. These select WCAG 2.1 A/AA rules including the 2.0
requirements. Do not disable rules or exclude elements. Compare the full
violations array with `[]` so failures retain rule IDs, affected targets,
failure summaries, and help URLs. Attach full axe JSON to an HTML report alongside
the console list reporter, with automatic report opening disabled. Reports and
failure artifacts remain ignored by Git.

The initial scans found `html-has-lang` on both routes. Set the English document
language once through Nuxt's `app.head.htmlAttrs` so it also appears in the
production document shell; page components continue to own their titles.
No Nord internals or validation behavior need changing.

On this Mac, default WebKit Tab skips buttons, checkboxes, and links because
Keyboard navigation is off. Confirmed the same behavior on a disposable native
HTML page: Tab skipped those controls, while Option-Tab reached them in order.
Use native Option-Tab (`Alt+Tab` in Playwright) only for macOS WebKit, keeping
ordinary Tab elsewhere and the same control-by-control focus assertions.
This exercises actual keyboard navigation without modifying the DOM, forcing
focus, changing user preferences, or skipping tests. See the
[Playwright WebKit keyboard discussion](https://github.com/microsoft/playwright/issues/41808)
and [Apple's keyboard shortcuts](https://support.apple.com/en-lamr/guide/safari/cpsh003/mac).

Verified on 2026-11-01 using Node 24.22.2 and macOS 26.5.2: all 22 production
browser cases pass in Chromium 156 and WebKit 27.2, as do four unit tests,
application/browser-test type checking, and the production build. All six scans
report zero selected violations. Actual zoom and spoken screen-reader
checks remain open in [browser verification notes](browser-verification.md).

Checked official Playwright guidance for
[projects](https://playwright.dev/docs/test-projects),
[accessibility states, rule tags, and result attachments](https://playwright.dev/docs/accessibility-testing),
and [browser installation and WebKit](https://playwright.dev/docs/browsers#webkit).
