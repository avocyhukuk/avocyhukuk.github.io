import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// NOT: ESLint 9'a sabitlenmiş durumda. eslint-plugin-jsx-a11y (henüz) ESLint 10
// desteklemiyor ve CLAUDE.md Bölüm 4/4'te erişilebilirlik "temel şart" olarak
// tanımlandığı için a11y kurallarını kaybetmemeyi tercih ettik. Yalnızca bir
// geliştirme bağımlılığı — siteye gönderilen koda dahil değil. jsx-a11y ESLint 10
// desteği verdiğinde ikisi birlikte yükseltilmeli.

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'public/**',
      '.wrangler/**',
      'coverage/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Hesaplama araçlarında sessiz hataya yol açabilecek kalıplar
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    // Komut satırı scriptlerinde konsol çıktısı arayüzün kendisidir.
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },

  // Prettier ile çakışan biçimlendirme kurallarını kapat — en sonda olmalı.
  prettier,
];
