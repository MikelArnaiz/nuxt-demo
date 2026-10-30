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
need appears. Framework and tooling versions will be selected during setup.

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
