import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
    ],
  },
  {
    files: ['app/assets/js/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        FormData: 'readonly',
        confirm: 'readonly',
        Element: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      strict: 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
    },
  },
];

