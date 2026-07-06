import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // Global ignores (ported from the previous .eslintignore)
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'public/**',
      '.now/**',
      '.git/**',
      'sessions/**',
      '.vercel/**',
    ],
  },

  // Base JS recommended config
  js.configs.recommended,

  // Plain JS files (config files, mocks, setup files, etc.)
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
  },

  // TypeScript / React source files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
        FacebookPageContext: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // TypeScript handles undefined identifiers; the core rule false-positives
      // on type-only references (e.g. in .d.ts files).
      'no-undef': 'off',

      // Project rules (ported from the previous .eslintrc.json)
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // styled-jsx uses the `jsx` and `global` attributes on <style>
      'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Jest rules for test files
  {
    files: ['**/__tests__/**', '**/*.test.{js,jsx,ts,tsx}'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },

  // Disable stylistic rules that conflict with Prettier (must be last)
  prettierConfig,
];
