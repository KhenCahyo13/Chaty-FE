import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'vite.config.ts',
    'src/components/ui/**/*.tsx',
    'src/components/tanstack-form/**/*.tsx',
    'src/components/blocks/**/*.tsx',
    'src/components/editor/**/*.tsx',
    'src/stories/**/*.tsx',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      perfectionist,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'max-lines': ['error', { max: 500 }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'perfectionist/sort-objects': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-object-types': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-interfaces': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-union-types': ['error', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-jsx-props': ['error', { type: 'natural', order: 'asc' }],
      'no-console': 'error',
    },
  },
])
