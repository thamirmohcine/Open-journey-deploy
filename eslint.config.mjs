import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs', 
      globals: {
        ...globals.node, 
      },
    },
    rules: {
      'indent': ['error', 2],        
      'quotes': ['error', 'single'],     
      'semi': ['error', 'always'],        
      'no-console': 'off',               
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^next$' }], 
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'], 
  },
];