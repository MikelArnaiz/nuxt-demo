export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  ssr: false,
  modules: ['@nuxt/eslint'],
  eslint: {
    config: { stylistic: false },
  },
  app: {
    head: { htmlAttrs: { lang: 'en' } },
  },
  devtools: { enabled: false },
  css: ['@nordhealth/css'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('nord-'),
    },
  },
})
