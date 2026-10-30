import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getEmailError, getPasswordError, validateSignup } from '../app/utils/signup-validation.ts'

test('empty signup reports required errors in validation priority order', () => {
  assert.deepEqual(validateSignup({ email: '', password: '' }, false), [
    { name: 'email', error: 'Enter your email address.' },
    { name: 'password', error: 'Enter your password.' },
  ])
})

test('whitespace-only email is missing, even if format is also invalid', () => {
  assert.equal(getEmailError(' \t\n ', true), 'Enter your email address.')
})

test('browser email mismatch selects the format error', () => {
  assert.equal(getEmailError('person', true), 'Enter a valid email address.')
})

test('valid email with surrounding whitespace has no error', () => {
  assert.equal(getEmailError('  person@example.com  ', false), null)
})

test('person@localhost is accepted when browser email validation reports no mismatch', () => {
  assert.equal(getEmailError('person@localhost', false), null)
})

test('valid email and missing password are validated independently', () => {
  assert.deepEqual(validateSignup({ email: 'person@example.com', password: '' }, false), [
    { name: 'email', error: null },
    { name: 'password', error: 'Enter your password.' },
  ])
})

test('password has no strength rules and is never trimmed', () => {
  for (const password of ['x', ' ', ' \t ', ' example ']) {
    assert.equal(getPasswordError(password), null)
  }
})

test('repeated validation removes corrected errors and reports newly invalid values', () => {
  assert.deepEqual(validateSignup({ email: 'person', password: '' }, true), [
    { name: 'email', error: 'Enter a valid email address.' },
    { name: 'password', error: 'Enter your password.' },
  ])
  assert.deepEqual(validateSignup({ email: 'person@example.com', password: 'example' }, false), [
    { name: 'email', error: null },
    { name: 'password', error: null },
  ])
  assert.deepEqual(validateSignup({ email: 'person@', password: '' }, true), [
    { name: 'email', error: 'Enter a valid email address.' },
    { name: 'password', error: 'Enter your password.' },
  ])
})
