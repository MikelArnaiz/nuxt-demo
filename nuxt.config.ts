export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  ssr: false,
  nitro: {
    prerender: {
      // Pages serves files directly, so each route needs its own entry file.
      routes: ['/', '/success'],
    },
  },
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
