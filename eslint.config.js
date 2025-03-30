import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier'; // Import Prettier plugin
import prettierConfig from 'eslint-config-prettier'; // Import Prettier config

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // Add Jest globals
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier: prettierPlugin }, // Add Prettier plugin
    rules: {
      ...prettierConfig.rules, // Add Prettier rules
      'prettier/prettier': 'error', // Enforce Prettier formatting as ESLint errors
    },
    extends: ['js/recommended'], // Remove "plugin:prettier/recommended"
  },
]);
