module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'prefer-arrow-callback': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  env: { node: true, es2020: true },
};
