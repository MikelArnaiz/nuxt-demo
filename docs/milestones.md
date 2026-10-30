# Implementation milestones

Implement one milestone at a time. A milestone can contain several small commits;
each commit should have one clear purpose and leave a reviewable change.

Before moving on, explain what changed, how Vue or Nuxt implements it, why the
approach was chosen, and how it was verified. Update the decision log when a
meaningful choice changes. Do not scaffold later features ahead of their milestone.
Explain the learning topics using React comparisons for an author new to Vue.
Keep tutorial notes in [Vue and Nuxt learning notes](vue-nuxt-learning-notes.md);
commit them alongside the implementation. Keep the README focused on setup,
commands, and project-specific information.

## 0. Record the specification

- [x] Document assignment requirements and project assumptions.
- [x] Define observable behavior and acceptance criteria.
- [x] Record milestones and initial decisions.

Done when: the project has a readable implementation contract without application code.

## 1. Minimal Nuxt application

- [x] Scaffold Nuxt and TypeScript in this repository, preserving these documents.
- [x] Configure client-side rendering and replace starter content with one heading.
- [x] Add development, type-check, and build instructions to the README.
- [x] Verify the app locally, type checking, and the production build.

Milestone 1 was verified on 2026-10-30 using Node 24.22.2: `npm run typecheck` and
`npm run build` passed. Browser inspection of both `npm run dev` and
`npm run preview` showed the single level-one “Sign up” heading.
Decision D9 records the setup choices.

Learn: Nuxt's role, configuration, entry point, single-file components, and
`<script setup>`. Explain what runs in the browser and what the build tool does.

## 2. Nord integration

- [x] Add Nord styles and components for a minimal sign-up form with an Email
  input and a “Create account” submit button.
- [x] Configure custom-element recognition and template types.
- [x] Verify Nord component rendering and template types.
- [x] Verify the current submit form in the browser and run type checking
  and the production build.

The `signup-form` contains an Email input using `type="email"` and
`autocomplete="email"`, and a “Create account” submit button.
`@submit.prevent` prevents native submission from reloading the page or putting
email in the URL; application submission logic is not implemented yet.
The input retains native email-format validation; custom validation remains
milestone 5.

Nord template typing has been verified by checking that an invalid button
variant produces a TypeScript error. The completed milestone 3 form was checked
on 2026-10-30: pointer and Enter submission left fields populated and the URL
unchanged, without email in the URL. No application warnings or errors appeared;
Lit reports its expected development-mode notice. `npm run typecheck` and
`npm run build` passed using Node 24.22.2.
Decision D10 records the integration choices.

Learn: Web Components versus Vue components, registration, compiler configuration,
CSS imports, and template typing. Check current official guidance before setup.

## 3. Static sign-up page

- [x] Build the complete form using the specified labels, controls, and hints.
- [x] Adapt the careers sign-in layout: white page, centered “Sign up” heading,
  approximately 470px content column, generous whitespace, and no form card.
  Start with the heading, without a logo, header, or reserved header space.
- [x] Use Nord controls and tokens with left-aligned field labels and full-width
  inputs and primary submit button, following the spec's visual direction.
- [x] Inspect mobile/desktop presentation and keyboard order.

Verified on 2026-10-30 using Node 24.22.2: type checking and production build
passed. Browser inspection confirmed a 470px desktop form, matching input and
submit widths, and no horizontal overflow at 320 CSS pixels (272px form plus
24px side padding). Required markers, masked password, autocomplete hints, and
an initially unchecked checkbox were checked. Tab order is Email → Password →
Show password → product updates → Create account, with Nord focus styling.
The visibility button is static until milestone 4; custom validation and
navigation remain in milestones 5 and 6. Decision D11 records layout choices.

Learn: templates, attributes, semantic HTML, composition, and styling. Application
state, custom validation, and navigation are introduced in later milestones.

## 4. Reactive form state

- [x] Connect email, password, and opt-in to local state.
- [x] Implement password visibility without submitting or losing the value.
- [x] Verify each interaction manually without logging credentials.

Verified on 2026-10-30 using Node 24.22.2: type checking and production build
passed. Browser checks covered initially empty fields and unchecked opt-in,
email/password edits, pointer and keyboard checkbox changes, and password
visibility using pointer, Enter, and Space. The action label and input type
changed together, values survived repeated toggles, and visibility did not submit
or trigger native required-field focus. Pointer/Enter submission stayed on the
same URL with values retained; reload reset the fields, opt-in, and visibility.
Disposable samples were used without adding credential logs to application code.

Console checks caught and verified the fix for a Nord light-DOM interaction:
the changing button label needs a stable span to preserve Nord's proxy button
and Lit marker nodes. Fresh-page checks after the fix showed no application
warnings or errors, only Lit's expected development-mode notice. Decision D12
records the binding and integration choices.

Learn: reactive state, property bindings, events, `v-model`, and derived values.
Explain the differences from React state and rendering.

## 5. Validation and errors

- [ ] Handle submission and the specified validation rules and timing.
- [ ] Display associated errors and focus the first invalid field.
- [ ] Add focused validation tests where they provide useful coverage.
- [ ] Verify empty, malformed, corrected, and newly invalid values.

Learn: submission events, pure logic, conditional rendering, element references,
and DOM update timing. Choose validation ownership explicitly so browser messages
and application errors do not compete.

## 6. Success navigation

- [ ] Add `/success` and navigate only after valid submission.
- [ ] Reuse the content width, typography, and spacing from sign-up, without a logo or header.
- [ ] Add the return link, page titles, and navigation focus behavior.
- [ ] Verify direct visits, refreshes, browser back, and fresh form state.

Learn: file-based routing, navigation, component lifetime, and page metadata.
Document any static-host fallback needed for direct route access.

## 7. Browser verification

- [ ] Add a small browser suite covering the core acceptance scenarios.
- [ ] Exercise actual Nord components rather than replacing them with test doubles.
- [ ] Manually inspect keyboard use, errors, focus, zoom, and responsive layout.
- [ ] Check both routes against the visual acceptance criteria, allowing Nord
  component styling to take precedence over exact matching of the reference.
- [ ] Run type checking, tests, and the production build; fix discovered issues.

Learn: behavior-oriented tests, Web Component boundaries, and when a browser test
provides evidence that a unit test cannot. Avoid duplicating every assertion at
every testing level.

## 8. Submission preparation

- [ ] Finish README setup, run, test, and build instructions.
- [ ] Explain simulated registration, assumptions, and relevant trade-offs.
- [ ] Verify installation and documented commands from a clean setup.
- [ ] Review the acceptance checklist and explain the implementation end to end.

Done when: another developer can run and assess the project using the README,
and the author can explain each meaningful decision.
