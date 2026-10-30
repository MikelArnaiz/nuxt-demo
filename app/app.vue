<script setup lang="ts">
const heading = 'Sign up'
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
        required
        expand
        size="l"
      />
      <div class="password-field">
        <nord-input
          label="Password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          expand
          size="l"
        />
        <nord-button class="password-visibility" type="button" variant="default">
          Show password
        </nord-button>
      </div>
      <nord-checkbox
        name="product-updates"
        label="Receive occasional product updates and announcements."
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
