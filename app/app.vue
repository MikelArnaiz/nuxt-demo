<script setup lang="ts">
const heading = 'Sign up'
</script>

<template>
  <main>
    <h1>{{ heading }}</h1>
    <form class="signup-form" @submit.prevent>
      <nord-input label="Email" name="email" type="email" autocomplete="email" />
      <nord-button type="submit" variant="primary">Create account</nord-button>
    </form>
  </main>
</template>

<style scoped>
main {
  padding: var(--n-space-l);
}

.signup-form {
  display: grid;
  justify-items: start;
  gap: var(--n-space-m);
  margin-block-start: var(--n-space-m);
}
</style>
