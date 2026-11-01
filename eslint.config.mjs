import prettier from 'eslint-config-prettier/flat'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.data/**',
      '**/.cache/**',
      '**/dist/**',
      '**/coverage/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/.husky/_/**',
    ],
  },
  {
    files: ['**/*.vue'],
    rules: {
      // Attribute ordering is presentation; Prettier owns formatting.
      'vue/attributes-order': 'off',
      // Nord uses native Web Component slots, not Vue's deprecated slot syntax.
      'vue/no-deprecated-slot-attribute': [
        'error',
        { ignoreParents: ['/^nord-/'] },
      ],
    },
  },
  prettier,
)
