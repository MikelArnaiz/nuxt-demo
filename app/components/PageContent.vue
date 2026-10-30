<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps<{ heading: string }>()
const headingElement = useTemplateRef<HTMLHeadingElement>('headingElement')

useHead(() => ({ title: `${props.heading} | Sign-up demo` }))

// Each page owns this shell. Mounting a destination also focuses its heading,
// including direct visits; tabindex="-1" keeps it out of the normal Tab order.
onMounted(() => headingElement.value?.focus())
</script>

<template>
  <main class="page-content n-reset">
    <h1 ref="headingElement" tabindex="-1">{{ heading }}</h1>
    <slot />
  </main>
</template>

<style scoped>
.page-content {
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

h1:focus-visible {
  outline: 2px solid var(--n-color-accent);
  outline-offset: var(--n-space-s);
}
</style>
