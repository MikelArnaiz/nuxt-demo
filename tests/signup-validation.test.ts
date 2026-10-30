import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getEmailError, getPasswordError, validateSignup } from '../app/utils/signup-validation.ts'

test('empty signup reports required errors in validation priority order', () => {
  assert.deepEqual(validateSignup({ email: '', password: '' }, false), [
    { name: 'email', error: 'Enter your email address.' },
    { name: 'password', error: 'Enter your password.' },
  ])
})

test('email errors prioritize missing values over browser format mismatches', () => {
  assert.equal(getEmailError(' \t\n ', true), 'Enter your email address.')
  assert.equal(getEmailError('person', true), 'Enter a valid email address.')
  assert.equal(getEmailError('person@example.com', false), null)
})

test('password has no strength rules and is never trimmed', () => {
  assert.equal(getPasswordError(''), 'Enter your password.')
  for (const password of ['x', ' ']) {
    assert.equal(getPasswordError(password), null)
  }
})

test('valid signup has no field errors', () => {
  assert.deepEqual(validateSignup({ email: 'person@example.com', password: 'example' }, false), [
    { name: 'email', error: null },
    { name: 'password', error: null },
  ])
})
