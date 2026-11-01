<script setup lang="ts">
const props = defineProps<{ heading: string }>()

useHead(() => ({ title: props.heading }))
</script>

<template>
  <main class="page-content n-reset">
    <h1>{{ heading }}</h1>
    <slot />
  </main>
</template>

<style scoped>
.page-content {
  box-sizing: border-box;
  max-inline-size: calc(470px + 2 * var(--n-space-l));
  margin-inline: auto;
  padding: var(--n-space-xl) var(--n-space-l);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-block-size: 100svh;
}

h1 {
  margin: 0 0 var(--n-space-xl);
  color: var(--n-color-text);
  font-size: var(--n-font-size-xxxl);
  font-weight: var(--n-font-weight-heading);
  line-height: var(--n-line-height-heading);
  text-align: center;
}
</style>
