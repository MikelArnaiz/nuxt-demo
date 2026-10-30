import { test as base, expect, type Page } from '@playwright/test'

// Every test gets an isolated browser context and exercises the shipped Nord elements.
const test = base.extend<{ cleanConsole: void }>({
  cleanConsole: [async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (['error', 'warning'].includes(message.type())) errors.push(message.text())
    })
    await use()
    expect(errors, 'production browser warnings and errors').toEqual([])
  }, { auto: true }],
})

function controls(page: Page) {
  return {
    email: page.getByRole('textbox', { name: /Email/ }),
    // Password inputs have no implicit textbox role. CSS locators cross open
    // shadow roots, allowing real input actions without mocking Nord internals.
    password: page.locator('nord-input[name="password"]').locator('input'),
    updates: page.getByRole('checkbox', { name: 'Receive occasional product updates and announcements.' }),
    submit: page.getByRole('button', { name: 'Create account', exact: true }),
  }
}

async function expectFreshForm(page: Page) {
  const { email, password, updates } = controls(page)
  await expect(page).toHaveURL('/')
  await expect(page).toHaveTitle('Sign up')
  await expect(email).toHaveValue('')
  await expect(password).toHaveValue('')
  await expect(password).toHaveAttribute('type', 'password')
  await expect(updates).not.toBeChecked()
  await expect(page.getByText(/Enter your (email address|password)\.|Enter a valid email address\./)).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Show password', exact: true })).toBeVisible()
}

test('fresh controls expose labels, required state, autocomplete, and natural keyboard order', async ({ page }) => {
  await page.goto('/')
  await expectFreshForm(page)
  const { email, password, updates, submit } = controls(page)
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1, name: 'Sign up', exact: true })).toHaveCount(1)
  await expect(email).toHaveAttribute('autocomplete', 'email')
  await expect(password).toHaveAttribute('autocomplete', 'new-password')
  await expect(email).toHaveAttribute('required', '')
  await expect(password).toHaveAttribute('required', '')
  await expect(submit).toBeEnabled()
  await expect(page.locator('h1')).not.toHaveAttribute('tabindex')
  for (const control of [email, password, page.getByRole('button', { name: 'Show password', exact: true }), updates, submit]) {
    await page.keyboard.press('Tab')
    await expect(control).toBeFocused()
  }
})

test('invalid submission associates errors, focuses in field order, and revalidates edits', async ({ page }) => {
  await page.goto('/')
  const { email, password, updates, submit } = controls(page)
  await submit.click()
  await expect(email).toBeFocused()
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toHaveAccessibleDescription('Enter your email address.')
  await expect(password).toHaveAttribute('aria-invalid', 'true')
  await expect(password).toHaveAccessibleDescription('Enter your password.')
  await expect(page.getByText('Enter your email address.', { exact: true })).toBeVisible()
  await expect(page.getByText('Enter your password.', { exact: true })).toBeVisible()

  await email.fill('person@example.com')
  await expect(email).not.toHaveAttribute('aria-invalid')
  await expect(email).not.toHaveAttribute('aria-describedby')
  await submit.click()
  await expect(password).toBeFocused()
  await password.fill('demo-password')
  await updates.check()
  await expect(password).not.toHaveAttribute('aria-invalid')
  await email.fill('person@')
  await expect(email).toHaveAccessibleDescription('Enter a valid email address.')
  await password.press('Enter')
  await expect(page).toHaveURL('/')
  await expect(email).toBeFocused()
  await expect(email).toHaveValue('person@')
  await expect(password).toHaveValue('demo-password')
  await expect(updates).toBeChecked()
  await password.fill('')
  await expect(password).toHaveAccessibleDescription('Enter your password.')
  await page.reload()
  await expectFreshForm(page)
})

test('email validity comes from the browser, including whitespace and malformed addresses', async ({ page }) => {
  await page.goto('/')
  const { email, password, submit } = controls(page)
  await password.fill('demo-password')
  for (const address of ['   ', 'person', '@example.com', 'person@']) {
    await email.fill(address)
    await submit.click()
    await expect(page).toHaveURL('/')
    await expect(email).toBeFocused()
    await expect(email).toHaveAccessibleDescription(address.trim() ? 'Enter a valid email address.' : 'Enter your email address.')
  }
  await email.fill('  person@example.com  ')
  await expect(email).not.toHaveAttribute('aria-invalid')
  await submit.click()
  await expect(page).toHaveURL('/success')
})

test('password visibility preserves values and does not submit using pointer, Enter, or Space', async ({ page }) => {
  await page.goto('/')
  const { email, password, updates } = controls(page)
  await password.fill(' demo-password ')
  await page.getByRole('button', { name: 'Show password', exact: true }).click()
  await expect(password).toHaveAttribute('type', 'text')
  await expect(password).toHaveValue(' demo-password ')
  await page.getByRole('button', { name: 'Hide password', exact: true }).press('Enter')
  await expect(password).toHaveAttribute('type', 'password')
  await page.getByRole('button', { name: 'Show password', exact: true }).press('Space')
  await expect(password).toHaveAttribute('type', 'text')
  await expect(password).toHaveValue(' demo-password ')
  await expect(email).not.toHaveAttribute('aria-invalid')
  await expect(page.getByText('Enter your email address.', { exact: true })).toHaveCount(0)
  await expect(page).toHaveURL('/')
  await page.keyboard.press('Tab')
  await expect(updates).toBeFocused()
  await page.keyboard.press('Space')
  await expect(updates).toBeChecked()
  await page.keyboard.press('Space')
  await expect(updates).not.toBeChecked()
})

for (const optedIn of [false, true]) {
  test(`valid sign-up with product updates ${optedIn ? 'selected' : 'unselected'} announces success and returns to fresh state`, async ({ page }) => {
    const requests: string[] = []
    const messages: string[] = []
    page.on('request', request => requests.push(`${request.method()} ${request.url()} ${request.postData() ?? ''}`))
    page.on('console', message => messages.push(message.text()))
    await page.goto('/')
    const { email, password, updates, submit } = controls(page)
    await email.fill('person@example.com')
    await password.fill('disposable-demo-password')
    if (optedIn) await updates.check()
    if (optedIn) await password.press('Enter')
    else await submit.click()
    await expect(page).toHaveURL('/success')
    await expect(page).toHaveTitle("You're signed up!")
    await expect(page.getByRole('heading', { name: "You're signed up!", level: 1 })).toBeVisible()
    const announcement = page.getByRole('status')
    await expect(announcement).toHaveAttribute('aria-live', 'polite')
    await expect(announcement).toHaveAttribute('aria-atomic', 'true')
    await expect(announcement).toHaveText("You're signed up!")
    await expect(page.locator('h1')).not.toBeFocused()
    await expect(page.getByRole('main')).not.toContainText('person@example.com')
    await expect(page.getByRole('main')).not.toContainText('disposable-demo-password')
    expect(requests.filter(request => /person(?:%40|@)example\.com|disposable-demo-password|^(POST|PUT|PATCH) /.test(request))).toEqual([])
    expect(messages.filter(message => /person@example\.com|disposable-demo-password/.test(message))).toEqual([])
    expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie })))
      .toEqual({ local: 0, session: 0, cookies: '' })

    await page.getByRole('link', { name: 'Back to sign up' }).press('Enter')
    await expectFreshForm(page)
    await expect(announcement).toHaveText('Sign up')
    await page.goBack()
    await expect(page).toHaveURL('/success')
    await expect(announcement).toHaveText("You're signed up!")
    await page.goForward()
    await expectFreshForm(page)
    await expect(announcement).toHaveText('Sign up')
  })
}

test('person@localhost and a whitespace-only password are accepted by actual browser controls', async ({ page }) => {
  await page.goto('/')
  const { email, password } = controls(page)
  await email.fill('person@localhost')
  await password.fill('   ')
  await password.press('Enter')
  await expect(page).toHaveURL('/success')
  await page.goBack()
  await expectFreshForm(page)
})

test('direct success visits and refreshes have generic content and natural initial focus', async ({ page }) => {
  await page.goto('/success')
  for (const refresh of [false, true]) {
    if (refresh) await page.reload()
    await expect(page).toHaveTitle("You're signed up!")
    await expect(page.getByRole('main')).toContainText('Your demo sign-up is complete. No account has been created.')
    await expect(page.locator('h1')).not.toHaveAttribute('tabindex')
    await expect(page.locator('body')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Back to sign up' })).toBeFocused()
  }
  await page.keyboard.press('Enter')
  await expectFreshForm(page)
})

for (const width of [1280, 320]) {
  test(`both routes keep readable content without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    for (const route of ['/', '/success']) {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const layout = await page.getByRole('main').evaluate(element => {
        const style = getComputedStyle(element)
        const heading = element.querySelector('h1')!
        return {
          contentWidth: element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
          headingAlign: getComputedStyle(heading).textAlign,
          bodyBackground: getComputedStyle(document.body).backgroundColor,
          overflows: document.documentElement.scrollWidth > window.innerWidth,
        }
      })
      expect(layout).toEqual({ contentWidth: width === 1280 ? 470 : 272, headingAlign: 'center', bodyBackground: 'rgb(255, 255, 255)', overflows: false })
      if (route === '/') {
        const { email, password, submit } = controls(page)
        await submit.click()
        await expect(email).toBeFocused()
        for (const control of [email, password, submit]) {
          const box = await control.boundingBox()
          expect(box).not.toBeNull()
          expect(box!.width).toBeCloseTo(layout.contentWidth, 0)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      }
      await page.screenshot({
        path: test.info().outputPath(route === '/' ? 'signup-errors.png' : 'success.png'),
        fullPage: true,
      })
    }
  })
}
