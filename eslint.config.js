import config from 'eslint-config-love'
import globals from 'globals'

// noinspection JSUnusedGlobalSymbols
export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021
      }
    }
  },
  config,
  {
    files: ["src/**/*.ts"],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@eslint-community/eslint-comments/require-description': 'off',
      'complexity': 'off',
      'no-console': 'off',
      'eqeqeq': ['error', 'smart'],
    }
  }
];
