# Learnings: Nuxt and Vue for a React developer

Milestone-by-milestone notes connecting this project to familiar React concepts.

# Milestone 1: Minimal Nuxt application

These learning notes are maintained alongside the project and committed with
the implementation.

## What we built and why

We turned the specification-only repository into a runnable Nuxt application.
The entire interface is one “Sign up” heading inside a `main` landmark. This
establishes the framework, TypeScript checks, and production build before we
introduce Nord, forms, or routing. Existing specification documents stay intact.

## Vue, Nuxt, and Vite have different jobs

Vue is the UI framework, occupying roughly the role React occupies in your
React projects. It creates components and updates the DOM.

Nuxt is the application framework built around Vue. Think of the relationship
between Next.js and React: Nuxt supplies conventions, application startup,
routing support, and a build pipeline. This is a comparison of responsibilities,
not a claim that their APIs or rendering defaults are identical.

Vite is the development server and build tool used here. It compiles `.vue`
files and TypeScript into code the browser understands, updates the running app
while you develop, and bundles the browser assets for production. You do not
need to configure Vite separately for this minimal Nuxt app.

## Start reading at `app/app.vue`

In a React application, you might write:

```tsx
export default function App() {
  const heading = 'Sign up'

  return (
    <main>
      <h1>{heading}</h1>
    </main>
  )
}
```

Our Vue component expresses the same interface:

```vue
<script setup lang="ts">
const heading = 'Sign up'
</script>

<template>
  <main>
    <h1>{{ heading }}</h1>
  </main>
</template>
```

A `.vue` file is a single-file component (SFC). It can contain a script block,
a template block, and an optional style block. We do not need styles yet.

`lang="ts"` lets the script use TypeScript. `<script setup>` is compiler syntax
for declaring component setup logic with less boilerplate. Its top-level
bindings are directly available to the template, so there is no explicit
`return { heading }` or component export to write here.

The template uses `{{ heading }}` for text interpolation, corresponding to
`{heading}` in JSX. Vue templates are compiled into render functions; the browser
does not interpret the `.vue` file or its template syntax directly.

There is one crucial difference from a React function component: setup code
runs when a component instance is created, rather than rerunning for every
reactive render update. Vue separately tracks reactive dependencies used by
rendering. Our heading is just a constant, so neither Vue reactive state nor
React `useState` is needed. We will cover changing state in milestone 4.

Nuxt finds `app/app.vue` by convention and mounts it as the root component.
You do not write a `createRoot(...).render(<App />)` bootstrap file. There are
no page components or application routes to wire up at this milestone.

## Read `nuxt.config.ts` next

```ts
export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  ssr: false,
  devtools: { enabled: false },
})
```

`defineNuxtConfig` gives the configuration typed tooling support. Nuxt makes
this helper available in the config file without an explicit import.

`ssr: false` is the central assignment requirement. The server delivers the
HTML shell and JavaScript, and Vue creates the interface in the browser. The
initial HTML does not already contain the rendered heading. JavaScript must
run before the user sees it. This resembles a client-rendered React SPA.

Client-side rendering does not mean there is no server process: development
and preview still need one to deliver files. The production build includes
Nitro's serving code; seeing a server build step does not mean the heading is
server-rendered.

`compatibilityDate` establishes a date for compatibility behavior used by
Nuxt's tooling and deployment integrations. It does not pin the installed
Nuxt version; `package.json` and `package-lock.json` handle dependencies.

Disabling devtools keeps the development toolbar out of this one-heading demo.
It does not disable TypeScript or browser developer tools.

## Understand the other setup files

| File | Purpose | React comparison |
| --- | --- | --- |
| `package.json` | Dependencies and commands; requires supported Node 24 | Same role in a React project |
| `package-lock.json` | Locks the installed dependency tree for `npm ci` | Same npm behavior |
| `.nvmrc` | Selects the Node 24 release line | Framework-independent runtime setup |
| `tsconfig.json` | References Nuxt-generated TypeScript configurations | A framework-managed TypeScript setup rather than hand-maintained aliases |
| `.gitignore` | Excludes dependencies and generated output | Same Git behavior |

Nuxt generates `.nuxt/` during preparation. The TypeScript references separate
browser app code, server code, shared code, and Node tooling contexts. Referencing
these configurations does not mean we have implemented backend features.
Generated files should not be edited; Nuxt recreates them.

We pinned Nuxt and Vue and used TypeScript 5.9 with `vue-tsc` for checking Vue
components. Node 24 satisfies this Nuxt release's engine requirements; the
machine's default Node 25 does not. For verification, a temporary Node 24 runtime
was used without changing the machine's default. Use the README's nvm commands
to select a supported runtime in your own shell.

## What runs where

1. `npm ci` installs the locked dependencies and runs our `postinstall` script,
   `nuxt prepare`, which generates framework types and configuration.
2. `npm run dev` starts Nuxt and Vite locally. Vite compiles source modules for
   the browser and supports live development updates.
3. The browser loads the generated JavaScript. Vue runs component setup and
   mounts the heading into the DOM. TypeScript types have been removed.
4. `npm run typecheck` checks TypeScript and Vue templates without being the
   application runtime. This is separate from compiling a runnable build.
5. `npm run build` produces deployable output in `.output/`.
6. `npm run preview` serves that output locally for inspection.

As in many React build setups, successfully transpiling TypeScript does not
prove the types are correct. That is why we run both type checking and build.

## How milestone 1 was verified

Using Node 24.22.2, `npm run typecheck` and `npm run build` both passed.
Browser inspection showed the single level-one “Sign up” heading in development
and in production preview. These checks establish that the minimal app compiles
and renders. Form behavior, accessibility interactions, and Nord integration
are still work for later milestones.

## Check your understanding

- Why is there no `createRoot` call? Nuxt owns application bootstrapping.
- Why no `useState` equivalent? The heading never changes.
- Does `<script setup>` rerun on every reactive update? No; setup belongs to
  instance creation, while rendering tracks reactive dependencies separately.
- Does `ssr: false` remove the need to serve files? No; it determines where the
  interface is rendered.
- Does a passing production build replace type checking? No.

When explaining this milestone aloud: “Nuxt boots a Vue root component. Its
TypeScript setup declares a constant that the compiled template displays.
SSR is disabled, so Vue renders it in the browser. We verified types, the
production build, and browser rendering before adding form features.”

# Milestone 2: Nord integration

## What changed

The page has a Nord Email input and a “Create account” submit button inside
`signup-form`. The input uses `type="email"` and `autocomplete="email"`.
Vue does not own the field's value yet, similar to an uncontrolled input in
React. Reactive sign-up state remains milestone 4's topic.

The form uses `@submit.prevent` to cancel native submission, keeping the page
and URL unchanged. Account creation and navigation are not implemented yet.

## Web Components are browser elements

A Vue component is created and managed by Vue. A Web Component is a custom HTML
element registered with the browser, so it can also be used outside Vue or
React. Here, `<nord-input>` and `<nord-button>` are Web Components built by Nord.
Their internal markup and styles live inside shadow roots. Vue renders the
host elements and sets their attributes; Nord implements the controls.

There are three separate integration steps:

1. **Register runtime behavior.** `app/plugins/nord.client.ts` imports Input and
   Button. Those modules register the custom elements with the browser. Nuxt
   discovers the plugin and runs it before mounting the application. The
   `.client.ts` suffix makes its browser-only role explicit. We import only the
   components used by this milestone, rather than Nord's entire catalog.
2. **Tell the Vue compiler about the tags.** `vue.compilerOptions.isCustomElement`
   in `nuxt.config.ts` recognizes names beginning with `nord-`. Otherwise Vue
   would try to resolve them as Vue components and could report resolution
   warnings. This setting does not register any browser elements itself.
3. **Load template types.** `app/types/nord.d.ts` imports Nord's Vue declarations.
   They augment Vue's component typings so editors and `vue-tsc` understand
   properties such as the button's `variant`. This file supplies tooling support,
   not runtime behavior. Unlike a React JSX declaration, it describes what can
   appear in a Vue SFC template.

The client plugin's empty `defineNuxtPlugin` callback is deliberate: registration
happens when its imports execute, and there are no services to inject. No Vue
wrapper component is needed for either element.

## Styles and template attributes

Nuxt's `css` configuration loads `@nordhealth/css` globally. This is separate
from component registration and makes Nord's CSS utilities and design tokens
available to the page. The installed CSS package exports its stylesheet from
its root; an old deep import fails the build. Our scoped layout styles use
`--n-space-l` and `--n-space-m` rather than inventing spacing values.

`<style scoped>` makes Vue scope our layout selectors to this component. It
is comparable in purpose to locally scoped styling in a React project, though
Vue implements it with generated selector attributes. It does not reach into
Nord's shadow roots or override control internals.

The input's `label` supplies its visible and accessible name. The button's
`variant="primary"` selects Nord's appearance, while `type="submit"` makes it
a submit control for the enclosing form. These are static template attributes,
similar to literal JSX props.

Vue's `@submit.prevent` listens for the form's submit event and calls
`preventDefault()`. In React, the equivalent is an `onSubmit` handler calling
`event.preventDefault()`. It prevents native navigation and keeps email out of
the URL, but does not implement application validation or registration. Native
email-format validation still applies before the browser dispatches submission.

## Verification status

Nord's template types reject an invalid button variant with a TypeScript error.
Browser verification was completed against the expanded milestone 3 form:
keyboard order and pointer/Enter submission were checked, fields stayed
populated, and the URL stayed unchanged without email in it. Type checking and
the production build passed; see the milestone 3 verification notes below.

No permanent test suite is included yet. Milestone 7 adds browser coverage for
the complete sign-up flow.

## References and questions

Setup follows the current [Nord Vue integration guidance](https://nordhealth.design/docs/developer/web-components/#vue)
and its [input documentation](https://nordhealth.design/components/input/),
checked on 2026-10-30, plus the installed packages' exports and declarations.

- Does compiler recognition make a custom element work? No; runtime registration
  is a separate responsibility.
- Do TypeScript declarations register elements? No; types disappear at runtime.
- Why not use `v-model` now? The field currently manages its own value.
  Connecting application state is a later milestone.
- Why a client plugin? It gives the browser registrations a clear, shared startup
  location before Vue mounts, even as the app later gains multiple pages.

# Milestone 3: Static sign-up page

## What changed and why

`app/app.vue` now contains the complete static form: required Email and Password
inputs, a secondary “Show password” button, an optional product-updates checkbox,
and a primary “Create account” button. The page starts with a centered heading
on a white background. Its desktop form is 470px wide and shrinks on mobile.
Checkbox is registered in the existing client plugin because it is now used.

The form remains in one component: there is no repeated field pattern that
needs a shared component yet. Vue does not hold the field values in application
state. Like uncontrolled React inputs, Nord's controls manage their own current
values. The visibility button is intentionally static at this milestone;
reactive state and toggling are milestone 4's work.

## Templates and semantic HTML

Vue templates look like HTML. Unlike JSX's `className`, use `class` for CSS
classes. Literal attributes such as `label="Password"` and `size="l"` select
fixed component properties. Boolean attributes such as `required` and `expand`
enable those options through Nord's attribute APIs. Do not write
`required="false"` to disable a boolean attribute: its presence enables it.
Dynamic values will use Vue's `:` binding syntax in a later milestone.

HTML still supplies the page structure: `main` is the primary landmark, `h1`
names the page, and `form` groups the controls. The Nord labels name their
internal inputs, and `required` supplies visible markers and native required
semantics. `autocomplete="email"` and `autocomplete="new-password"` tell the
browser how to help fill the fields; they do not store values in Vue state.

`type="button"` on the visibility control explicitly separates its action from
form submission. `type="submit"` on Create account participates in normal form
submission, including Enter from a text field. `@submit.prevent` continues to
cancel native navigation. Native required/email validity still applies for now;
milestone 5 will choose application validation ownership explicitly.

Composition here means combining ordinary HTML and existing Nord elements.
The password input and visibility button share a small layout `div`, without a
wrapper component or a separate state abstraction. Their document order also
gives the intended keyboard order without adding `tabindex` values.

## Layout styles and the Web Component boundary

Nord's `n-reset` class opts the main content into its typography and box-sizing
rules. Importing the stylesheet alone does not apply that class. Nord's spacing,
type, and color tokens keep the page consistent with its controls. The inputs
and submit button use the supported `expand` attribute instead of reaching into
their shadow roots. Large controls give the primary fields and action room.

The scoped CSS controls page layout: a grid spaces form items, a smaller grid
groups the password controls, and `justify-self: end` aligns the visibility
button. `max-inline-size` caps the content at 470px plus side padding, while
normal block sizing lets it become narrower on mobile. `margin-inline: auto`
centers it. Logical properties describe inline and block axes rather than
hard-coding left/right positioning.

This has the same separation of concerns as composing React components with
local CSS: the page owns arrangement, and the design system owns the controls.
Vue's scoped selectors are rewritten with component attributes; they do not
penetrate shadow roots. `:global(body)` deliberately applies only the page's
body margin and background globally, outside that scoped selector rewriting.

## Verification

On 2026-10-30, using Node 24.22.2, `npm run typecheck` and `npm run build` passed.
Browser measurements confirmed 470px desktop form, input, and submit widths.
At 320 CSS pixels, the form measured 272px with 24px padding on either side,
and the page had no horizontal overflow. The checkbox label wrapped normally.

Keyboard checks followed Email → Password → Show password → product updates →
Create account; Nord's focus styling remained visible. The initial form showed
required markers, empty fields, a masked password input, and an unchecked opt-in.
The internal inputs received the expected autocomplete hints. Pointer and Enter
submission with disposable sample values kept the form populated on the same
URL. Console inspection showed only Lit's expected development-mode notice.

These checks establish the static page and integration. They do not verify
password toggling, custom errors, or success navigation, which are later work.

When explaining this milestone aloud: “The template composes semantic HTML and
Nord controls. Static attributes configure the controls, while scoped CSS and
Nord tokens arrange a responsive form. We checked the real browser controls,
keyboard order, mobile sizing, types, and production build before adding state.”

# Milestone 4: Reactive form state

## Local state and the React comparison

`app/app.vue` now owns email, password, product-updates opt-in, and password
visibility as local `ref`s. The initial values are empty strings and `false`.
They belong to the component instance; reloading creates fresh state. There is
no global store, browser storage, request, or credential logging.

In React, local state might begin with `const [email, setEmail] = useState('')`.
Vue's equivalent here is `const email = ref('')`. A ref is a reactive container:
script reads and assignments use `email.value`. `const` prevents replacing the
container variable, but its `.value` can change. Templates automatically unwrap
top-level refs, so the template uses `email`, not `email.value`.

React's setter schedules a render with a new state snapshot. In Vue, assigning
`email.value` changes the reactive value immediately and schedules dependent
DOM updates. The setup block does not rerun on each edit; Vue tracks the refs
used by rendering and updates the affected interface. DOM updates are batched,
so changed state does not imply that the browser DOM is already updated in the
same synchronous statement.

## Property bindings and events

The email field connects both directions explicitly:

```vue
<nord-input :value="email" @input="updateEmail" />
```

`:` abbreviates `v-bind:`: the value is a JavaScript expression rather than the
literal string `"email"`. `@` abbreviates `v-on:` and registers an event listener.
The handler reads the Nord host element's public `value` property and assigns
it to `email.value`. Password uses the same pattern. Nothing trims or transforms
the password, including its leading or trailing spaces.

This resembles React's `value={email}` plus
`onChange={event => setEmail(event.currentTarget.value)}` for a controlled input.
Here, Nord emits a DOM `input` event on each text edit. The checkbox instead
binds `:checked="productUpdates"` and reads `checked` on `change`: its selection
is a boolean, not the checkbox's string submission value.

The handler parameter is an ordinary `Event`. TypeScript does not infer a Nord
element from `currentTarget`, so the handler asserts the specific Nord element
type. These `import type` declarations disappear from runtime JavaScript.
`currentTarget` identifies the element where our listener is installed, even
though Nord's native input lives inside a shadow root. Application code uses
the public host API rather than reaching into that shadow root.

## Where `v-model` fits

On a native text input, `<input v-model="email">` is shorthand for a value
binding plus an input listener. Native checkbox `v-model` uses `checked` and
`change`. On a Vue component, the default contract is `modelValue` with an
`update:modelValue` event.

Nord controls are custom browser elements with their own property/event APIs.
In particular, a `nord-checkbox` tag does not automatically select Vue's native
checkbox model behavior. We use explicit bindings consistently for these three
fields so the integration is visible and correctly uses `checked`. There is no
need for a Vue wrapper or custom directive for this small form. See the official
[form bindings](https://vuejs.org/guide/essentials/forms.html) and
[custom-element properties](https://vuejs.org/guide/extras/web-components.html#passing-dom-properties)
guidance for the two different boundaries.

## Derived values and password visibility

`passwordVisible` is the only visibility state. Two `computed` refs derive the
input type (`password` / `text`) and action label (“Show password” / “Hide
password”). Computed getters track the refs they read and cache their results
until those dependencies change. Templates unwrap computed refs too.

In React these small derived expressions would usually be calculated directly
during rendering; `useMemo` would be unnecessary for such cheap work. Vue's
`computed` makes the dependency explicit without maintaining additional state.
Do not create independent mutable refs for the label and type: they could drift
out of sync with visibility.

The click expression `passwordVisible = !passwordVisible` uses template
unwrapping to change the boolean ref. Vue updates `:type="passwordType"` and
the button's text. The existing password input stays mounted, preserving its
value. `type="button"` keeps this action out of form submission. The label
describes the next action for both sighted and screen-reader users.

The label lives inside `<span>{{ passwordVisibilityLabel }}</span>`. Nord adds
a hidden proxy button and Lit marker nodes to its light DOM for form behavior.
Bare interpolation directly under `nord-button` allowed Vue's text update to
remove those nodes, producing console errors despite the visible toggle still
working. A stable span confines Vue's text updates to the content it owns and
preserves the nodes Nord owns. This is an integration boundary to check in the
real browser, not something TypeScript can prove.

Application validation and success navigation are still later milestones. The
form retains `@submit.prevent` and its existing native validity behavior.

## Verification

On 2026-10-30 with Node 24.22.2, `npm run typecheck` and `npm run build` passed.
Manual browser checks used disposable samples for text edits and checkbox
selection with pointer and keyboard. Pointer, Enter, and Space all toggled
password visibility and its action name while retaining the entered values.
An empty-form visibility toggle kept focus on the button instead of triggering
native required-field focus. Pointer/Enter submission preserved the form and
URL. Reload restored empty fields, unchecked opt-in, and a hidden password.

Fresh-page console checks after the stable-span fix showed no application
warnings or errors; Lit emitted its expected development-mode notice. No
credential logging was added. A permanent browser suite remains milestone 7.

When explaining this milestone aloud: “Local refs own the form values. Explicit
property bindings and DOM events connect Nord controls to Vue. Computed values
keep password type and action text in sync, and a stable label span respects
the DOM nodes Nord owns. We checked real controls, keyboard behavior, types,
build output, and console messages before introducing custom validation.”

# Milestone 5: Validation and errors

## Submission owns when errors appear

The form now uses `novalidate` and `@submit.prevent="submit"`. These do different
jobs: `novalidate` lets the submit handler run without browser validation
popovers, while `.prevent` cancels native submission and its page navigation.
Nord still receives `required` and `type="email"` for field semantics and UI.

In React this is comparable to `<form noValidate onSubmit={handleSubmit}>`, with
`event.preventDefault()` inside the handler. It is normal form submission, so
both clicking Create account and pressing Enter use the same path. The
visibility control keeps `type="button"` and does not enter that path.

A local `submitted` ref starts as `false`. The handler sets it to `true`, and
it stays true until the component is recreated. A computed value derives the
current errors:

```ts
const validationResults = computed<SignupValidationResult[]>(() => {
  if (!submitted.value) return []

  emailValidator.value = email.value.trim()
  return validateSignup(
    { email: email.value, password: password.value },
    emailValidator.validity.typeMismatch,
  )
})
```

The first branch hides errors before an attempt. Afterward, the getter reads
email and password, so editing either invalidates its cached result. Corrected
errors disappear and newly invalid values produce errors again. No watcher or
extra mutable error refs are needed. Neither checkbox nor visibility state is
a validation dependency, and editing never moves focus.

In React, we could calculate the same errors during rendering from form state
and a `submitted` state value. The Vue getter reacts to the refs it reads;
`<script setup>` itself does not rerun after every keystroke.

## Separate browser rules from message selection

`emailValidator` is a detached native input with `type="email"`. Assigning a
trimmed copy of the email and reading `validity.typeMismatch` uses the browser's
format rules without displaying its messages. This is supported here because
Nuxt has `ssr: false`: component setup runs in the browser, where `document`
exists. An SSR application would need to defer browser-only work appropriately.

Nord's public API does not supply this validity result. A separate native input
avoids coupling application logic to the component's internal shadow DOM. It is
never mounted, cannot receive focus, and does not join form submission. Its value
is only a temporary validation copy; the code never assigns a trimmed password
or changes the form state as part of validation.

`app/utils/signup-validation.ts` exports two pure field validators:
`getEmailError(value, emailTypeMismatch)` and `getPasswordError(value)`. The email
validator receives a boolean snapshot of browser `validity.typeMismatch`; Node
tests can supply `true` or `false`. Both return a message or `null` and have no
Vue imports, DOM access, input refs, persistence, or side effects.

The utility also exports `SignupFieldName`, `SignupValidationResult`, and the pure
aggregation function `validateSignup(values, emailTypeMismatch)`. It returns
`{ name, error }` entries in documented validation priority order: email before
password. This matches the displayed form. Each `SignupValidationResult` constrains
`name` to `SignupFieldName = 'email' | 'password'`.

The component owns the computed wrapper and its submission gate. A separate
`Record<SignupFieldName, TemplateRef<NordInput>>` maps names to refs; TypeScript
requires every known field name and rejects unknown keys. This keeps input refs
separate from the pure utility. The component derives the error lookup with
`Object.fromEntries`, omitting
entries whose error is `null`. The computed lookup has the explicit type
`SignupErrors = Partial<Record<SignupFieldName, string>>`, so missing messages
are `undefined` and misspelled field names are rejected by TypeScript.
The same `SignupFieldName` type constrains validation names, ref mappings, and
the error lookup's keys.
Empty/whitespace-only email takes precedence over format mismatch. Password
validation checks length directly, so even a single space is nonempty. The
validators can be tested independently, like plain utilities used by a React
component.

## Conditional errors through Nord

`:error="errors.email"` and `:error="errors.password"` bind the current messages
to the custom elements' public properties. When a field has no error, its value
is `undefined`. Nord conditionally displays its built-in error UI, sets
`aria-invalid` on the actual input, and connects the message with
`aria-describedby` inside the same shadow root. It also supplies an error alert.

For ordinary Vue-owned markup, `v-if="errors.email"` would mount a node only when
the expression is truthy, much like `{errors.email && <p>...</p>}` in React.
Here Nord already owns conditional error rendering and accessibility wiring,
so a second paragraph would duplicate that responsibility. Setting ARIA only
on a host element would not prove that its internal native input is associated
with the message; the real browser checks inspected that boundary.

## Element refs and two DOM update queues

`useTemplateRef<NordInput>('emailInput')` connects to `ref="emailInput"` in the
template; password has its own typed ref. Each `.value` is the Nord host element
after mount and can be null
before mounting or after unmounting. This resembles React's `useRef` plus a
`ref` prop, though Vue uses a matching template-ref name and `.value` instead
of `.current`. A DOM ref grants access to an element; it does not replace the
separate reactive ref that owns the email string.

Invalid submission uses `.find()` on the validation array to choose the first
field with an error, then reads `inputRefs[firstInvalidField.name].value`. This keeps the
focus helper independent of individual fields and avoids a DOM selector. The
component owns the computed wrapper and a complete ref mapping; the utility
produces the result array from values. The submit validity
check similarly uses `.some()` rather than listing field names. Before focusing,
the handler waits:

```ts
await nextTick()
await firstInvalidInput.updateComplete
firstInvalidInput.focus()
```

`nextTick` waits for Vue to flush the property bindings. Nord is built with Lit
and schedules its own rendering after those properties change. Its
`updateComplete` promise waits for that work, so the error exists and is
associated before Nord's public `focus()` forwards focus to the internal input.
No timeout or application shadow-root query is necessary. In React, an effect
or layout effect is commonly used for work after a commit; with a Web Component
there can still be a second component-owned update to await.

## Verification and its limits

`npm test` uses Node 24's built-in test runner and native TypeScript stripping.
No test framework dependency was added. The eight tests cover required errors,
missing-email precedence, supplied format mismatch, surrounding email
whitespace, explicit `person@localhost` acceptance, missing password, unchanged nonempty
passwords, and repeated correction/regression. Type stripping runs code; it does
not type-check it.
Application types are checked separately with `npm run typecheck`.

These tests receive the browser's format result; passing `true` in a unit test
does not prove that an address is malformed. Browser checks with actual Nord
elements supplied that evidence for `person`, `@example.com`, `person@`, valid
addresses with surrounding spaces and `person@localhost`. Single-label domains
are deliberately accepted; a dotted-domain requirement would be an additional
application rule. Decision D13 records the consequences of this choice.
Browser checks also covered
initial error suppression, empty submission, whitespace email/password,
correction and newly invalid edits, pointer/Enter submission, first-invalid
focus, accessible error associations, value retention, checkbox choices,
password visibility, and reset on reload. Narrow-screen errors had no horizontal
overflow. No application errors or warnings appeared; Lit emitted its expected
development-mode notice.

On 2026-10-30 using Node 24.22.2, all eight tests, type checking, and production
build passed. Valid submission currently stays on the form: success navigation
is milestone 6. A permanent browser suite remains milestone 7.

References: [Nord Input](https://nordhealth.design/components/input/),
[Vue template refs](https://vuejs.org/guide/essentials/template-refs.html),
[Vue `nextTick`](https://vuejs.org/api/general.html#nexttick),
[HTML email inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email),
and [Node TypeScript support](https://nodejs.org/api/typescript.html).

When explaining this milestone aloud: “Submission enables a computed validation
array, and later edits keep it current. Browser validity supplies email rules,
while a pure function selects our messages. Nord renders associated errors, and
we wait for Vue and Nord to update before focusing the first invalid field.
Unit tests cover our rules; browser checks cover the real controls.”

# Milestone 6: Success navigation

## Files become routes

`app/app.vue` now renders `<NuxtPage />`. Nuxt discovers `app/pages/index.vue`
as `/` and `app/pages/success.vue` as `/success`, and renders the matching page
inside that outlet. There is no hand-written route table. Nuxt uses Vue Router
underneath; `NuxtPage` provides Nuxt's page lifecycle around it.

With React Router, an outlet displays a matched route configured in a route
tree. Nuxt's file convention supplies that configuration. If you know Next.js,
file-based routing is a familiar idea, though Nuxt's directory conventions and
runtime APIs differ. Nuxt auto-imports its routing helpers and Vue components
under `app/components`; TypeScript checking verifies their use.

## Navigate after validation

The form's existing submit handler first enables validation. If no validation
entry has an error, it awaits `navigateTo('/success')` and returns. Otherwise, it keeps
the existing first-invalid-field focus behavior. Both pointer submission and
Enter follow this same handler; opt-in does not affect validity.

This is comparable to calling React Router's navigation function after checking
form state. `navigateTo` is Nuxt's navigation helper; awaiting it handles the
navigation operation before the handler completes. It changes routes through
the client router without a native form request or full document reload.
There is no registration request, loading state, or artificial delay.

The success page uses `<NuxtLink to="/">Back to sign up</NuxtLink>`. This renders
a real anchor with a destination, preserving normal link semantics and keyboard
activation while supporting client navigation. It fills the same role as a
React router's `Link`, rather than using a button that imperatively changes URLs.

## Component lifetime resets the form

All five form refs and the submitted flag moved with the form into the index
page. They are not in the persistent root, a shared store, or browser storage.
The success route receives none of those values and shows generic content.

Without KeepAlive, leaving the form unmounts its component instance. Returning
through the link or browser history creates another instance and executes its
setup with empty strings and false booleans. A hidden password, unchecked opt-in,
and no errors follow from those defaults. No reset watcher or manual field
clearing is necessary. This matches React local state being discarded when a
route component unmounts and initialized again when it remounts. Browser Back
restores the route; it does not resurrect the old Vue component instance.

Direct `/success` visits and refreshes intentionally work too. The page grants
no access and proves no authentication, so a guard or stored success flag would
not provide useful protection.

## Share a shell with props and a slot

`PageContent.vue` owns the repeated main landmark, centered heading, content
width, and Nord spacing/type tokens. Each page passes a fixed `heading` prop
and supplies its content between the component tags. `<slot />` renders that
content, similar to React's `children`. `defineProps<{ heading: string }>()`
declares and types the component's input; props flow down rather than providing
shared mutable form state.

The form keeps its own scoped field-layout styles. The root keeps the global
body background and margin. Sharing the shell now has a concrete purpose:
both pages stay visually consistent without duplicating the layout rules.
An additional Nuxt layout abstraction is unnecessary for these two routes.

## Titles and live route announcements

The shell uses `useHead(() => ({ title: ... }))` to derive the document title
from its heading, giving “Sign up” and
“You're signed up!”. `useHead` manages browser head elements with
the component's lifetime; it replaces a manual effect writing `document.title`.
The callback reads the current prop so the metadata remains reactive.
`definePageMeta` instead describes router behavior such as layouts or guards;
it is not needed just to set a document title.

Before milestone 7, we removed the original `onMounted` heading focus, template
ref, `tabindex="-1"`, and heading outline styling. That focus moved the user's
position and produced an intrusive outline, even on a direct visit or refresh.
`tabindex="-1"` had only made programmatic focus possible; the `.focus()` call
was what actually moved focus.

The root now renders `<NuxtRouteAnnouncer politeness="polite" :atomic="true" />`
alongside `NuxtPage`. This built-in component keeps a visually hidden live region
mounted while pages change and updates it from the document title after head
metadata renders. `polite` lets assistive technology announce the change without
interrupting current speech; `atomic` requests the entire title. On success, the
message is “You're signed up!”.

In React terms, this is a persistent announcement component above the routed
content rather than a focus effect in each page. There is no custom route
watcher, timer, or duplicate message state. It communicates the destination
without focusing the heading. On a fresh visit, Tab reaches Email on sign-up
or the return link on success. Normal interactive focus styling and the
first-invalid-input focus remain in place.

## Direct routes need host support

Client navigation already has the app loaded. A direct `/success` request first
reaches the server, which must return the app entry HTML so the client router can
render that page. The production Nuxt server does this. A static host needs the
generated SPA files and a fallback/rewrite that preserves the requested URL.
The README records the setup; no provider-specific deployment has been chosen.
This is the same hosting concern as a React SPA using browser-history URLs.

## Verification

On 2026-10-30 with Node 24.22.2, all eight validation tests, type checking, and
production build passed. Browser checks used actual Nord controls against the
production preview: empty and malformed submissions stayed on sign-up; valid
pointer and Enter submissions reached success with opt-in off and on.
`person@localhost` remained accepted. Success showed no form values.

Direct access, refreshes, keyboard return-link activation, and browser
Back/Forward worked and titles updated. These original checks included heading
focus; the live-region replacement was verified separately before milestone 7.
Returning to sign-up recreated empty fields, masked password, unchecked opt-in,
and no validation errors. Both routes retained approximately 470px desktop
content and 272px content at a 320 CSS-pixel viewport, with no horizontal
overflow. No production console warnings or errors appeared. Static-host
configuration is documented, not deployed. Permanent browser tests stay in
milestone 7.

References: [Nuxt routing](https://learn.nuxt.com/en/concepts/routing),
[Nuxt navigation](https://nuxt.com/docs/4.x/api/utils/navigate-to),
[Nuxt head metadata](https://nuxt.com/docs/4.x/api/composables/use-head),
[Nuxt deployment](https://nuxt.com/docs/4.x/getting-started/deployment), and
[Nuxt route announcer](https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer).

When explaining this milestone aloud: “Nuxt turns page filenames into routes.
Valid submission navigates to generic success, and leaving the form discards
its local state. A shared shell keeps layout and titles consistent, while the
root announces title changes without moving focus. Returning mounts a fresh
form; direct routes also need server or
static-host fallback support.”

# Milestone 7: browser verification

## Test the behavior across framework and Web Component boundaries

`npm test` still tests the pure validation helpers with Node. It proves message
selection and password rules, but it cannot prove browser email semantics,
Nord's accessible error associations, native Enter submission, focus, or routing.
For example, passing `false` as the email mismatch flag in a unit test only
proves how our helper uses that flag. Entering `person@localhost` into the real
form and reaching success proves that the browser and application agree.

The eight Playwright tests run against a fresh production Nuxt build with actual
Nord custom elements. They use normal fill, click, Tab, Enter, and Space actions.
Vue's `@input`/`@change` handlers update refs, computed validation updates Nord
properties, and Nord asynchronously renders its native inputs and errors.
Assertions such as `toHaveAccessibleDescription` and `toBeFocused` wait for the
observable result; tests do not call the Vue submit function or add sleeps for
Vue's `nextTick` or Lit's `updateComplete`.

In React, the same test would exercise an input event through a state setter
and rerender. A useful browser test describes what the person does and sees,
so it need not change if an internal ref/computed implementation changes.
Avoid asserting each reactive assignment or repeating every unit-test case.
The unit and browser suites answer different questions.

## Cross open shadow roots without replacing Nord

Nord custom elements own shadow DOM. Most Playwright locators traverse open
shadow roots, so roles and accessible names find the actual email input,
checkbox, and buttons. A password input has no implicit textbox role; its
locator scopes a native `input` to `nord-input[name="password"]` instead.
This small integration-specific selector is preferable to replacing the Nord
input with a plain input that would hide registration, event, label, and focus
problems. The same boundary applies to Web Components used in React.

`toHaveAccessibleDescription` checks that the field actually references its
error, not just that an error string exists somewhere on the page. Fresh-form
assertions after the return link and browser history verify that Nuxt unmounted
the old route's local state. Title/live-region assertions verify the persistent
root announcer separately from the routed page.

## Own the server, isolate the browser, and type-check the tests

`playwright.config.ts` defines a dedicated production server on port 4173.
`npm run test:browser` builds before starting it and refuses an occupied port,
so a passing run cannot accidentally test a different running development app.
Playwright stops the server when the run finishes. Each test gets a fresh
browser context, avoiding dependence on another test's storage or history.
An automatic fixture collects production warnings/errors for each test.

The browser test code runs in Node while the application runs in the browser.
`tsconfig.browser.json` checks the test/configuration files separately from
Nuxt's generated app project; `npm run typecheck` runs both checks. Playwright
transpiles TypeScript for execution but does not replace static type checking.
The distinction is the same for a React app built with a tool that transpiles
TypeScript without checking it.

## Know what automation leaves unproven

The suite checks both routes at 320px width for horizontal overflow, including
validation errors. Human inspection checks desktop/mobile wrapping, visual
rhythm, and recognizable focus styling; failure screenshots help diagnose issues.
Narrow viewports are reflow evidence, not proof of actual browser zoom.

The route announcer's polite/atomic attributes and changing message can be
asserted in the DOM. Whether VoiceOver or NVDA speaks the message, and whether
it is repeated or interrupted, needs a real screen-reader session. Keep those
limits explicit: [verification notes](browser-verification.md) record the passed
checks and the remaining zoom/speech steps. The milestone's manual checkbox
remains open. The original ten browser/eight unit tests were trimmed to eight
browser/four unit tests after review. The full success/privacy/history flow runs
once; the single-label-email/Enter case covers the other opt-in choice. Repeated
calls to a pure function do not test Vue reactivity, so live correction is checked
only in the browser. Exact CSS values are left to visual review. This keeps the
tests focused on separate failure modes, rather than treating assertion count
as a measure of confidence.

References: [Playwright web server](https://playwright.dev/docs/test-webserver),
[shadow-DOM locators](https://playwright.dev/docs/locators#locate-in-shadow-dom),
and [projects](https://playwright.dev/docs/test-projects).

When explaining this milestone aloud: “Unit tests check the pure validation
rules. Browser tests exercise Vue, real Nord controls, and Nuxt navigation
together against production output. Waiting for user-visible outcomes keeps
the tests independent of framework scheduling, while zoom and spoken
screen-reader behavior still need manual evidence.”
