# Implementation decisions

These decisions describe the completed demo. See the [README](../README.md) for
features, setup, verification results, and known limitations.

## 1. Simulate registration and keep state local

Registration is simulated, so valid submission navigates locally without a
request, artificial delay, or loading state. Form values live in the
sign-up page's Vue refs, with no global store, persistence, or logging. Leaving
the route discards that state; returning creates a fresh form.

Success contains no personal data and is directly accessible. A guard or stored
registration flag would imply authentication that this frontend demo does not
provide. The product-updates checkbox demonstrates interaction without saving
a preference.

## 2. Integrate Nord Web Components directly

A Nuxt client plugin registers only the components used by the app. Nuxt recognizes
`nord-*` elements, loads Nord CSS globally, and includes Nord's shipped Vue types.
Direct integration keeps a small form simple without wrapper components.

Bind `value`/`checked` properties and handle `input`/`change` events explicitly:
these custom elements do not implement Vue's component `v-model` convention.
Use Nord's public labels, error, focus, and slot APIs. A stable span around the
password button's changing content preserves Nord's light-DOM proxy and Lit
markers. Bundle its two icons locally to avoid runtime asset requests.

## 3. Use browser email semantics and a minimal password rule

Email validation checks a trimmed copy using a detached native `type="email"`
input's `validity.typeMismatch`. Nord's public Input API does not expose that
native validity result. This preserves browser semantics without accessing
shadow DOM, adding a regex, or introducing a validation library.

Single-label domains such as `person@localhost` are valid syntax; there is no
deliverability check. A password is valid if nonempty, including whitespace-only
input. It is never trimmed or transformed. Stronger policies would be additional
product requirements. Pure validation utilities select messages and return
results in displayed field order: email, then password.

## 4. Show errors on submission, then update them on edits

The form uses `novalidate` and prevents native submission so application messages
and timing remain consistent. Required indicators and email semantics stay on
Nord's inputs. Submit remains enabled so invalid attempts can explain errors.
One submitted flag gates computed validation; errors derive from current values
rather than being stored separately. Visibility and opt-in do not affect validity.

Nord's public `error` property owns message rendering and accessibility associations.
Invalid submission preserves values and focuses the first invalid input. Await
Vue's `nextTick()` and Nord's Lit `updateComplete` before calling `focus()` so the
error exists first. Subsequent edits update errors without moving focus.

## 5. Share presentation and announce route changes

File-based pages own `/` and `/success`; `PageContent` shares the main landmark,
heading, title, width, and spacing. No extra layout layer is needed for two pages.
The centered heading, narrow form, and generous whitespace keep attention on the
sign-up flow. Nord controls and tokens supply the styling. A growing
`min-block-size: 100svh` layout centers content
when space permits and keeps it reachable by scrolling on short screens.

One persistent `NuxtRouteAnnouncer` announces updated titles through a polite,
atomic live region. Navigation does not move focus to headings. Interactive
focus indicators and first-invalid-field focus remain available. The English
document language is set once in Nuxt's document configuration.

## 6. Test behavior across the real integration boundaries

Four Node unit tests check pure validation rules and message priority. Playwright
runs the same eight behavior tests and three axe states in Chromium and WebKit
against a fresh production build with real Nord controls. Isolated contexts,
observable-state assertions, and console checks cover the Vue/Nord/router
integration without mocks or fixed sleeps. Browser tests establish email
semantics and live error updates that pure-function tests cannot prove.

Axe scans the whole document, including open shadow roots, for selected WCAG 2.1
A/AA rules without exclusions or disabled rules. Full results, including incomplete
checks, are attached to the HTML report. Manual checks supplement automation:
viewport reflow does not prove browser zoom, DOM announcements do not prove speech,
and bundled WebKit is not the Safari application.

On macOS WebKit, keyboard tests use native Option-Tab because ordinary Tab skips
some controls in the tested configuration. The same behavior occurred in plain
HTML; all focus-order assertions remain, without forcing focus or changing
system preferences.

## 7. Accept the observed VoiceOver limitation

The author completed Safari/VoiceOver checks on 2026-11-01. Invalid inputs announce
their labels, required state, and generic invalid state. Specific error text is
spoken on submission but is not repeated when returning to an invalid input.
The same refocus behavior occurred in four isolated comparison cases, including
plain HTML without Vue, Nuxt, Nord, or shadow DOM; the cause was not established.

Accept this observed behavior for the demo and retain Nord's supported error
associations and submission announcements. No speculative workaround is added.
Manual zoom and contrast results are recorded separately from automated scan
results in the README; passing checks do not claim full accessibility conformance.

## 8. Keep setup reproducible and checks independent

Pin direct dependencies, commit the npm lockfile, and select the supported Node 24
release line with `.nvmrc`. Installation generates Nuxt's types/ESLint config and
installs repository-local Husky hooks. The recorded clean-install review used a
disposable clone and cached dependencies; it was not a new network-download test.

ESLint checks code, Prettier formats it, and TypeScript checks types separately
from the production build. The pre-commit hook runs lint-staged on staged files,
with its default backup, rollback, and protection of partially staged changes.
It applies formatting without semantic autofixes. Full type, build, and browser
checks stay outside the hook to keep local feedback quick; hooks can be bypassed,
so the standalone verification commands remain necessary.
