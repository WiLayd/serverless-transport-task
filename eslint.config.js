import { resolve } from 'path';
import parser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import tsSortKeysPlugin from 'eslint-plugin-typescript-sort-keys';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: resolve('./tsconfig.json'),
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      'typescript-sort-keys': tsSortKeysPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: resolve('./tsconfig.json'),
        },
      },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': ['warn'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'typescript-sort-keys/interface': 'error',
      'typescript-sort-keys/string-enum': 'error',
      'object-curly-spacing': ['error', 'always'],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*'],
        },
      ],
    },
  },
];
