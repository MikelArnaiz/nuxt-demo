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

One local `submitted` ref gates a computed error object. Before submission it is
empty; afterward it derives errors from current email/password values on each
edit. There is no separately synchronized error state or blur-based timing.
Password visibility and opt-in do not participate in validation.

Nord 5.4.4 does not expose native email validity through its public Input API.
Use one detached native `input` with `type="email"` to inspect `validity.typeMismatch`
for a trimmed copy of the email. It never enters the form or DOM. This preserves
browser email rules without a regex, validation dependency, native popover, or
application access to Nord's shadow DOM. A pure `validateSignup` function receives
that mismatch boolean and selects the required/format messages. It checks
password length directly, without trimming, strength rules, or transformation.

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

Typed `useTemplateRef` references identify the Nord host elements. On invalid
submission, select email before password, await Vue's `nextTick`, then await
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

## D14. Route pages own state; share presentation and heading focus

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

Focus the shell's heading in Vue's `onMounted`, using a typed template ref and
`tabindex="-1"`. Each page mounts its own shell, so client navigation (including
history) focuses the destination without router hooks, selectors, or timers.
Also focus on direct visits and refreshes: this is a deliberate consistent
starting point. The heading stays outside normal Tab order, with a visible
keyboard focus outline. From success, Tab reaches the `NuxtLink` return action.
No page transitions or cached page instances complicate this lifecycle.

The production Nuxt server handles direct routes. Static deployment requires
generating SPA output and configuring a host fallback to its entry HTML; document
that requirement without adding an unchosen provider's configuration.

Checked Nuxt's official [routing](https://learn.nuxt.com/en/concepts/routing),
[head metadata](https://nuxt.com/docs/4.x/api/composables/use-head), and
[deployment guidance](https://nuxt.com/docs/4.x/getting-started/deployment), and
the installed Nuxt 4.6.3 page runtime. Verified actual production route changes,
titles, focus, fresh state, direct access, refreshes, and responsive layout in
the browser. The permanent browser suite remains milestone 7.
