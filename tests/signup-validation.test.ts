import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateSignup } from '../app/utils/signup-validation.ts'

test('empty submission reports both required errors', () => {
  assert.deepEqual(validateSignup('', '', false), {
    email: 'Enter your email address.',
    password: 'Enter your password.',
  })
})

test('whitespace-only email is missing, even if format is also invalid', () => {
  assert.deepEqual(validateSignup(' \t\n ', 'example', true), {
    email: 'Enter your email address.',
  })
})

test('browser email mismatch selects the format error', () => {
  assert.deepEqual(validateSignup('person', 'example', true), {
    email: 'Enter a valid email address.',
  })
})

test('valid email with surrounding whitespace has no errors', () => {
  assert.deepEqual(validateSignup('  person@example.com  ', 'example', false), {})
})

test('person@localhost is accepted when browser email validation reports no mismatch', () => {
  assert.deepEqual(validateSignup('person@localhost', 'example', false), {})
})

test('valid email does not hide a missing password', () => {
  assert.deepEqual(validateSignup('person@example.com', '', false), {
    password: 'Enter your password.',
  })
})

test('password has no strength rules and is never trimmed', () => {
  for (const password of ['x', ' ', ' \t ', ' example ']) {
    assert.deepEqual(validateSignup('person@example.com', password, false), {})
  }
})

test('repeated validation removes corrected errors and reports newly invalid values', () => {
  assert.deepEqual(validateSignup('person', '', true), {
    email: 'Enter a valid email address.',
    password: 'Enter your password.',
  })
  assert.deepEqual(validateSignup('person@example.com', 'example', false), {})
  assert.deepEqual(validateSignup('person@', '', true), {
    email: 'Enter a valid email address.',
    password: 'Enter your password.',
  })
})
