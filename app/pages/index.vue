<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, type TemplateRef } from 'vue'
import type NordCheckbox from '@nordhealth/components/lib/Checkbox'
import type NordInput from '@nordhealth/components/lib/Input'
import { validateSignup, type SignupFieldName, type SignupValidationResult } from '../utils/signup-validation'

type SignupErrors = Partial<Record<SignupFieldName, string>>

const email = ref('')
const password = ref('')
const productUpdates = ref(false)
const passwordVisible = ref(false)
const submitted = ref(false)
const emailInput = useTemplateRef<NordInput>('emailInput')
const passwordInput = useTemplateRef<NordInput>('passwordInput')

const inputRefs: Record<SignupFieldName, TemplateRef<NordInput>> = {
  email: emailInput,
  password: passwordInput,
}

// Use the browser's email rules without depending on Nord's shadow DOM.
const emailValidator = document.createElement('input')
emailValidator.type = 'email'

const validationResults = computed<SignupValidationResult[]>(() => {
  if (!submitted.value) return []

  emailValidator.value = email.value.trim()
  return validateSignup(
    { email: email.value, password: password.value },
    emailValidator.validity.typeMismatch,
  )
})

function getFirstInvalidInput(): NordInput | null {
  const firstInvalidField = validationResults.value.find(field => field.error)
  if (!firstInvalidField) {
    return null
  } else {
    const inputField = inputRefs[firstInvalidField.name].value
    return inputField
  }
}

const errors = computed<SignupErrors>(() => Object.fromEntries(
  validationResults.value.flatMap(({ name, error }) => error === null ? [] : [[name, error] as const]),
))

const passwordType = computed(() => passwordVisible.value ? 'text' : 'password')
const passwordVisibilityLabel = computed(() => passwordVisible.value ? 'Hide password' : 'Show password')

function updateEmail(event: Event) {
  email.value = (event.currentTarget as NordInput).value
}

function updatePassword(event: Event) {
  password.value = (event.currentTarget as NordInput).value
}

function updateProductUpdates(event: Event) {
  productUpdates.value = (event.currentTarget as NordCheckbox).checked
}

async function submit() {
  submitted.value = true
  if (!validationResults.value.some(field => field.error)) {
    await navigateTo('/success')
    return
  }

  const firstInvalidInput = getFirstInvalidInput()
  if (!firstInvalidInput) return

  // Vue sets the error properties, then Nord renders their accessible messages.
  await nextTick()
  await firstInvalidInput.updateComplete
  firstInvalidInput.focus()
}
</script>

<template>
  <PageContent heading="Sign up">
    <form class="signup-form" novalidate @submit.prevent="submit">
      <nord-input
        ref="emailInput"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        :value="email"
        :error="errors.email"
        @input="updateEmail"
        required
        expand
        size="l"
      />
      <div class="password-field">
        <nord-input
          ref="passwordInput"
          label="Password"
          name="password"
          :type="passwordType"
          autocomplete="new-password"
          :value="password"
          :error="errors.password"
          @input="updatePassword"
          required
          expand
          size="l"
        />
        <nord-button
          class="password-visibility"
          type="button"
          variant="default"
          @click="passwordVisible = !passwordVisible"
        >
          <span>{{ passwordVisibilityLabel }}</span>
        </nord-button>
      </div>
      <nord-checkbox
        name="product-updates"
        label="Receive occasional product updates and announcements."
        :checked="productUpdates"
        @change="updateProductUpdates"
      />
      <nord-button type="submit" variant="primary" expand size="l">
        Create account
      </nord-button>
    </form>
  </PageContent>
</template>

<style scoped>
.signup-form {
  display: grid;
  gap: var(--n-space-l);
  min-inline-size: 0;
}

.password-field {
  display: grid;
  gap: var(--n-space-s);
  min-inline-size: 0;
}

.password-visibility {
  justify-self: end;
}
</style>
