<script setup lang="ts">
import { computed, ref } from 'vue'
import type NordCheckbox from '@nordhealth/components/lib/Checkbox'
import type NordInput from '@nordhealth/components/lib/Input'

const heading = 'Sign up'
const email = ref('')
const password = ref('')
const productUpdates = ref(false)
const passwordVisible = ref(false)

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
</script>

<template>
  <main class="signup-page n-reset">
    <h1>{{ heading }}</h1>
    <form class="signup-form" @submit.prevent>
      <nord-input
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        :value="email"
        @input="updateEmail"
        required
        expand
        size="l"
      />
      <div class="password-field">
        <nord-input
          label="Password"
          name="password"
          :type="passwordType"
          autocomplete="new-password"
          :value="password"
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
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  background: var(--n-color-surface);
}

.signup-page {
  box-sizing: border-box;
  max-inline-size: calc(470px + 2 * var(--n-space-l));
  margin-inline: auto;
  padding: var(--n-space-xl) var(--n-space-l);
}

h1 {
  margin: 0 0 var(--n-space-xl);
  color: var(--n-color-text);
  font-size: var(--n-font-size-xxxl);
  font-weight: var(--n-font-weight-heading);
  line-height: var(--n-line-height-heading);
  text-align: center;
}

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
