<template>
  <PageContent heading="You're signed up!">
    <div class="success-content">
      <p>Your demo sign-up is complete. No account has been created.</p>
      <NuxtLink to="/">Back to sign up</NuxtLink>
    </div>
  </PageContent>
</template>

<style scoped>
.success-content {
  display: grid;
  gap: var(--n-space-l);
}

p {
  margin: 0;
}
</style>
