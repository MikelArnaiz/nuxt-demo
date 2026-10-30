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

- [x] Handle submission and the specified validation rules and timing.
- [x] Display associated errors and focus the first invalid field.
- [x] Add focused validation tests where they provide useful coverage.
- [x] Verify empty, malformed, corrected, and newly invalid values.

Verified on 2026-10-30 using Node 24.22.2: all eight focused validation tests,
type checking, and production build passed. Browser checks with actual Nord
controls covered initial suppression of errors, empty submission, whitespace-only
email, malformed addresses (`person`, `@example.com`, `person@`), surrounding
email whitespace, corrected and newly invalid values, and a whitespace-only
password. Single-label domains such as `person@localhost` were accepted
because this demo follows HTML email-input validation. Requiring a dotted
domain would be an additional application rule.

The explicit `person@localhost` acceptance case has a focused message-selection
test and was also checked in the real browser. Decision D13 explains the wider
consequences of accepting single-label domains.

Pointer and Enter submission focused email first, or password when email was
valid. Nord's internal native inputs exposed `aria-invalid` and an
`aria-describedby` reference to their visible error; both were removed on
correction. Errors appeared in the accessibility tree. Opt-in selection and
entered values survived invalid submission; toggling visibility did not submit
or introduce errors before the first attempt. A narrow-viewport inspection
showed readable errors without horizontal overflow. Reload reset validation and
form state. Console checks showed only Lit's expected development-mode notice.

Decision D13 records validation ownership and focus timing. Valid submissions
stay on the form until success navigation is implemented in milestone 6.

Learn: submission events, pure logic, conditional rendering, element references,
and DOM update timing. Choose validation ownership explicitly so browser messages
and application errors do not compete.

## 6. Success navigation

- [x] Add `/success` and navigate only after valid submission.
- [x] Reuse the content width, typography, and spacing from sign-up, without a logo or header.
- [x] Add the return link, page titles, and live route announcements.
- [x] Verify direct visits, refreshes, browser back, and fresh form state.

Verified on 2026-10-30 using Node 24.22.2: all eight validation tests, type
checking, and production build passed. Production-preview browser checks with
real Nord controls covered invalid submission remaining on `/`, valid submission
using pointer and Enter with opt-in both selected and unselected, and accepted
`person@localhost`. Success showed generic content without form values.

Direct `/success` visits and refreshes worked. The keyboard return link and
browser Back/Forward updated titles. The original heading-focus behavior was
replaced with live announcements before milestone 7, as described below.
Returning to sign-up restored empty fields, hidden password, unchecked opt-in,
and no errors. The shared content measured approximately 470px on desktop;
both routes measured 272px at a 320 CSS-pixel viewport with no horizontal
overflow. Production console checks showed no warnings or errors.

Decision D14 records routing, component lifetime, titles, and live announcements
without automatic heading focus. The README documents
the SPA fallback required for static-host direct routes. No static host has been
deployed or configured. A permanent browser suite remains milestone 7.

Before milestone 7, replaced automatic heading focus with the persistent Nuxt
route announcer at the user's request. Reverified all eight validation tests,
type checking, and the production build. Development-browser checks confirmed
polite, atomic live-region title updates on successful submission, keyboard
return, and history navigation; no heading focus on direct visits or refreshes;
natural Tab order; and unchanged first-invalid-field focus. Screen-reader
speech still needs manual verification in milestone 7.

Learn: file-based routing, navigation, component lifetime, and page metadata.
Document any static-host fallback needed for direct route access.

## 7. Browser verification

- [ ] Add a small browser suite covering the core acceptance scenarios.
- [ ] Exercise actual Nord components rather than replacing them with test doubles.
- [ ] Include `person@localhost` as an accepted single-label email in the browser suite.
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
