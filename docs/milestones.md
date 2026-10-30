# Implementation milestones

Implement one milestone at a time. A milestone can contain several small commits;
each commit should have one clear purpose and leave a reviewable change.

Before moving on, explain what changed, how Vue or Nuxt implements it, why the
approach was chosen, and how it was verified. Update the decision log when a
meaningful choice changes. Do not scaffold later features ahead of their milestone.

## 0. Record the specification

- [x] Document assignment requirements and project assumptions.
- [x] Define observable behavior and acceptance criteria.
- [x] Record milestones and initial decisions.

Done when: the project has a readable implementation contract without application code.

## 1. Minimal Nuxt application

- [ ] Scaffold Nuxt and TypeScript in this repository, preserving these documents.
- [ ] Configure client-side rendering and replace starter content with one heading.
- [ ] Add development, type-check, and build instructions to the README.
- [ ] Verify the app locally, type checking, and the production build.

Learn: Nuxt's role, configuration, entry point, single-file components, and
`<script setup>`. Explain what runs in the browser and what the build tool does.

## 2. Nord integration

- [ ] Add Nord styles and the components for a minimal input/button example.
- [ ] Configure custom-element recognition and template types.
- [ ] Verify rendering and interaction without integration warnings or type errors.

Learn: Web Components versus Vue components, registration, compiler configuration,
CSS imports, and template typing. Check current official guidance before setup.

## 3. Static sign-up page

- [ ] Build the complete form using the specified labels, controls, and hints.
- [ ] Apply Nord tokens and a responsive layout.
- [ ] Inspect mobile/desktop presentation and keyboard order.

Learn: templates, attributes, semantic HTML, composition, and styling. Application
state, custom validation, and navigation are introduced in later milestones.

## 4. Reactive form state

- [ ] Connect email, password, and opt-in to local state.
- [ ] Implement password visibility without submitting or losing the value.
- [ ] Verify each interaction manually without logging credentials.

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
- [ ] Add the return link, page titles, and navigation focus behavior.
- [ ] Verify direct visits, refreshes, browser back, and fresh form state.

Learn: file-based routing, navigation, component lifetime, and page metadata.
Document any static-host fallback needed for direct route access.

## 7. Browser verification

- [ ] Add a small browser suite covering the core acceptance scenarios.
- [ ] Exercise actual Nord components rather than replacing them with test doubles.
- [ ] Manually inspect keyboard use, errors, focus, zoom, and responsive layout.
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
