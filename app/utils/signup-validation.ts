export interface SignupErrors {
  email?: string
  password?: string
}

// The caller supplies the browser's typeMismatch result for the trimmed email.
// Keep message selection independent of DOM elements and component state.
export function validateSignup(email: string, password: string, emailTypeMismatch: boolean): SignupErrors {
  const errors: SignupErrors = {}

  if (!email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (emailTypeMismatch) {
    errors.email = 'Enter a valid email address.'
  }

  if (password.length === 0) {
    errors.password = 'Enter your password.'
  }

  return errors
}
