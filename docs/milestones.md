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
speech was subsequently checked manually as recorded in milestone 7 and D19.

Learn: file-based routing, navigation, component lifetime, and page metadata.
Document any static-host fallback needed for direct route access.

## 7. Browser verification

- [x] Add a small browser suite covering the core acceptance scenarios.
- [x] Exercise actual Nord components rather than replacing them with test doubles.
- [x] Include `person@localhost` as an accepted single-label email in the browser suite.
- [x] Manually inspect keyboard use, errors, focus, and responsive layout.
- [x] Complete actual browser zoom and spoken screen-reader checks.
- [x] Check both routes against the visual acceptance criteria, allowing Nord
      component styling to take precedence over exact matching of the reference.
- [x] Run type checking, tests, and the production build; fix discovered issues.

Implemented and verified on 2026-10-30 with Node 24.22.2: all ten Chromium
browser tests and eight focused validation tests pass, along with application
and browser-test type checking and the production build. The suite builds and
serves production output, uses real Nord controls, and includes keyboard and
pointer interaction, error associations/focus, accepted `person@localhost`,
opt-in choices, route announcements, direct routes, refreshes, history, fresh
state, data-handling checks, and desktop/320px layout. No application changes
were needed. Decision D15 records the test tooling choices.

Manual keyboard, errors, focus styling, both routes' presentation, the careers
reference, and desktop/320px screenshots were inspected. The author completed
actual 200%/400% browser zoom and VoiceOver checks on 2026-11-01. VoiceOver reads
validation errors on submission but does not repeat their specific text when
returning to invalid fields in Safari. The same behavior reproduced with plain
HTML inputs. The author accepts this limitation for the demo; no further
investigation is pending. Decision D19 records the scope decision. Automated
live-region DOM assertions remain separate from the manual speech checks.
Submission preparation (now milestone 11) had not been started at that point.

Critical review subsequently trimmed the suite to eight browser tests and four
unit tests. Removed duplicate success/privacy/history runs, redundant email
examples and stateless "revalidation" assertions, and exact CSS-value checks.
The browser suite retains real-control email semantics, both opt-in choices,
pointer/Enter submission, accessible errors/focus, live correction, reset/history,
direct success/refresh, route announcements, and 320px overflow. Desktop visual
evidence above records the original manual pass; current tests no longer save
passing layout screenshots or assert exact desktop styling.
All twelve tests, application/test type checking, and the fresh production build
pass after the trim.

Learn: behavior-oriented tests, Web Component boundaries, and when a browser test
provides evidence that a unit test cannot. Avoid duplicating every assertion at
every testing level.

## 8. Form presentation improvements

- [x] Add the email placeholder “e.g. name@example.com”, keeping the visible Email
      label and the initially empty value.
- [x] Vertically center each page's heading and content together within the viewport,
      following [Nordhealth's careers sign-in page](https://careers.nordhealth.com/connect/login).
      Keep comfortable page padding and allow scrolling when content exceeds the
      available height, including on short screens, with errors, or at browser zoom.
- [x] Replace the current separate “Show password” / “Hide password” button with
      a square custom Nord button inside the password input's `end` slot, following
      [Nord's custom button example](https://nordhealth.design/components/input/#custom-button).
- [x] Conditionally render `nord-icon` with `name="interface-edit-on"` or
      `name="interface-edit-off"` according to password visibility; show only the
      icon for the current action.
- [x] Keep an accessible action name that switches between “Show password” and
      “Hide password”, plus a matching tooltip. Keep `type="button"`, keyboard
      access, and visible focus styling.
- [x] Preserve the entered password and existing validation behavior when
      toggling; update affected browser checks for the inline icon button.
- [x] Verify pointer, Enter, and Space interaction, icon/accessible-name updates,
      no accidental submission, the email placeholder, and desktop/mobile layout with
      actual Nord controls, including vertical centering and short-screen scrolling.

Done when: the email field has its example placeholder, both pages' headings and
content are vertically centered when space permits and remain reachable when it does
not, and the password field contains the working icon button at its right edge
with the same accessible action and value-preserving behavior as the current control.

Learn: named slots in Web Components, Vue conditional rendering, and accessible
icon-only actions, plus responsive viewport layout and placeholders versus labels.
Compare slot composition and conditional rendering with React.

Verified on 2026-10-31 using Node 24.22.2: four validation tests, eight
production Chromium browser tests, application/browser-test type checking, and
the production build passed. Real Nord controls expose the email placeholder,
exactly one locally bundled eye icon, and an accessible action name. Pointer,
Enter, and Space toggles preserve values, leave validation untouched, and do not
submit. The tooltip opens and follows the current action. Natural Tab order and
fresh-state/history checks still pass.

Visual inspection covered 1440×900, 320×800, and 320×240, including mobile errors
and keyboard focus styling. The heading/form group has equal space above and
below when it fits; short-screen content scrolls with reachable heading/submit
and no horizontal overflow. Desktop form width remains 470px. Decision D16
records slot composition, accessible naming, icon bundling, and the shared
centering layout. Actual browser zoom and spoken screen-reader checks were
subsequently completed under milestone 7, with the accepted limitation in D19.

## 9. Accessibility scans and WebKit coverage

- [x] Add WebKit alongside Chromium in the existing Playwright configuration.
      Run the existing behavior suite in both browsers against production output
      with real Nord components.
- [x] Add `@axe-core/playwright` scans in both browsers for the initial form,
      the form after empty submission with both required errors visible, and the
      success page reached through valid submission. Wait for each state to render
      before scanning.
- [x] Select WCAG 2.1 A/AA scan rules and assert no detected violations. Keep
      actionable violation details in failures; document any justified exception
      rather than broadly disabling rules or excluding the form.
- [x] Retain existing keyboard, password-toggle, focus, error-association,
      route-announcement, privacy, and responsive checks. Investigate browser
      differences without weakening the behavioral contract to make tests pass.
- [x] Document installation of both Playwright browsers, commands for the full
      suite and individual browser projects, and the limits of automated scans.
      Distinguish bundled WebKit coverage from actual Safari and VoiceOver testing.
- [x] Run the expanded browser suite, unit tests, type checking, and production
      build. Record automated results separately from milestone 7's completed
      manual zoom/screen-reader checks.

Done when: existing behavior and all three accessibility scan states pass in
Chromium and WebKit, with reproducible commands and accurately documented limits.

Learn: Playwright projects, browser-engine differences, axe scan scope, and why
automated accessibility rules complement interaction and assistive-technology checks.

Verified on 2026-11-01 with Node 24.22.2, Playwright 1.64.1, Chromium 156,
WebKit 27.2, and axe 4.14.0: all 22 production browser cases (eight behaviors
and three scans per browser), four unit tests, application/browser-test type
checking, and the production build passed. All six scans detected no selected
WCAG 2.1 A/AA violations, with no exclusions or disabled rules. The scans found
a missing document language; Nuxt now emits `lang="en"` on both routes.

macOS WebKit uses native Option-Tab in the keyboard tests, preserving every
focus-order assertion without changing system preferences or forcing focus.
Full axe results are attached to the saved HTML report. Axe leaves the primary
button's contrast inconclusive because of a Nord pseudo-element; this required
manual review, not a detected violation or suppressed rule. Decision D17
records the scope and evidence. Milestone 7's actual zoom and spoken
screen-reader checks are complete, with the accepted limitation recorded in D19.

## 10. Linting, formatting, and pre-commit checks

- [x] Configure ESLint for Nuxt/Vue and TypeScript and Prettier for formatting,
      keeping formatting rules from conflicting with lint rules. Ignore generated
      Nuxt/build output, dependencies, and test artifacts.
- [x] Add standalone `lint`, `format`, and `format:check` scripts and document
      their scope. Keep lint checking separate from automatic semantic fixes.
- [x] Resolve lint findings while preserving the specified application behavior.
- [x] Apply the initial repository formatting pass.
- [x] Set up Husky and lint-staged to format supported staged files and lint
      staged code before commits. Block on lint errors, preserve unrelated unstaged
      edits, and avoid running full type checking, builds, or browser tests in the hook.
- [x] Verify hook installation from the documented setup, successful formatting,
      rejection of a deliberate lint error, and preservation of partially staged
      work using disposable changes; remove those changes after verification.
- [x] Run lint, read-only formatting checks, unit tests, type checking, and the
      browser suite against production output. Verify formatting after the initial pass.
      Document that hooks are a local convenience and can be bypassed; no GitHub
      Actions workflow is planned.

Done when: standalone checks pass, the pre-commit hook provides fast staged-file
feedback, and another developer can reproduce setup without losing unstaged work.

Learn: linting versus formatting versus type checking, Git staging, and the
trade-off between convenient local hooks and independently runnable checks.

Tooling implemented and verified on 2026-11-01 using Node 24.22.2. ESLint,
four unit tests, application/browser-test type checking, and all 22 production
Chromium/WebKit cases pass; the browser command also builds production output.
The ESLint/Prettier compatibility check found no conflicting rules. Ignore-scope
checks confirmed that source, configuration, and tests are included while
generated output, dependencies, coverage, and test artifacts are excluded.

A disposable checkout passed a clean `npm ci`, generated Nuxt's ESLint config,
and installed Husky through the lifecycle scripts. A real disposable commit
invoked the hook successfully. Further checks verified staged-code formatting,
preservation of unstaged portions of the same file, unrelated tracked edits and
untracked files, and rejection of a deliberate unused-variable error. On failure,
the index and working files were restored exactly and no backup stash remained.
The disposable checkout was removed; the real repository's index was untouched.

The subsequently staged initial formatting pass is included in this milestone.
`format:check` now passes without writing files. Lint, all four unit tests, and
both TypeScript checks also pass after formatting.
Decision D18 records the configuration and small lint-driven changes.

## 11. Submission preparation

- [x] Finish README setup, run, test, and build instructions.
- [x] Explain simulated registration, assumptions, and relevant trade-offs.
- [x] Verify installation and documented commands from a clean setup.
- [x] Include Chromium/WebKit installation, accessibility scan scope, lint and
      formatting commands, and pre-commit setup in the final README review.
- [x] Review the acceptance checklist and explain the implementation end to end.

Done when: another developer can run and assess the project using the README,
and the author can explain each meaningful decision.

Completed on 2026-11-01 using Node 24.22.2 and npm 11.8.0. The README now covers
clone/setup, all verification commands, simulated registration, email/password
assumptions, state/privacy, Nord presentation, pre-commit behavior, and Node/static
hosting. The acceptance checklist separates verified behavior from outstanding
manual checks, and the learning notes trace the implementation end to end with
React comparisons. Decision D19 records the submission review scope.

A disposable clone installed all 785 locked packages with `npm ci` using cached
registry packages and regenerated Nuxt configuration/types and Husky hooks.
Chromium/WebKit installation completed using cached browser binaries. Lint,
formatting, four unit tests, both TypeScript checks, and all 22 production browser
cases pass, including six axe scans with zero detected selected-rule violations.
The browser command also verified the production build. Development and preview
servers returned 200 for direct/repeated requests to both routes on temporary
local ports; static generation produced the SPA entry/fallback and success route.
Adjusted the root `dist` ignore rule to cover Nuxt's generated symlink as well as
a directory, keeping static output out of Git status.
The original development server remains on port 3000.

Submission preparation and milestone 7's manual zoom and VoiceOver checks are
complete. On 2026-11-01, the author reported 6.17:1 for the primary button's white
text on `#3559C7` and confirmed completion of the manual contrast review. The
acceptance checklist records this manual result separately from axe's incomplete
assessment. D19 records the accepted VoiceOver limitation and contrast evidence.
Passing automated checks is not a claim of full accessibility conformance.
