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
The current form still needs browser checks for typing, keyboard order, pointer
and keyboard submission, preservation of input, and no navigation or email in
the URL. Check the browser console and run `npm run typecheck` and
`npm run build` as recorded in the milestone checklist.

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
