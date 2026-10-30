export type SignupFieldName = 'email' | 'password'

export type SignupValidationResult = {
  name: SignupFieldName
  error: string | null
}

// The caller supplies the browser's typeMismatch result for the trimmed email.
export function getEmailError(value: string, emailTypeMismatch: boolean): string | null {
  if (!value.trim()) {
    return 'Enter your email address.'
  }

  if (emailTypeMismatch) {
    return 'Enter a valid email address.'
  }

  return null
}

export function getPasswordError(value: string): string | null {
  return value.length === 0 ? 'Enter your password.' : null
}

export function validateSignup(
  values: Record<SignupFieldName, string>,
  emailTypeMismatch: boolean,
): SignupValidationResult[] {
  // Validation priority follows the displayed form order: email, then password.
  return [
    { name: 'email', error: getEmailError(values.email, emailTypeMismatch) },
    { name: 'password', error: getPasswordError(values.password) },
  ]
}
