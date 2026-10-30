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
