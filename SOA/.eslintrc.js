module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'sonarjs'],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: false,
    jest: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: false,
      impliedStrict: true,
    },
    sourceType: 'module',
  },
  globals: {
    strapi: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['off', 'unix'],
    'no-console': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    'object-curly-spacing': 'off',
    'no-plusplus': 'off',
    'max-params': ['error', { max: 3 }],
    'max-lines-per-function': [
      'error',
      { max: 100, skipBlankLines: true, skipComments: true },
    ],
    'max-nested-callbacks': ['error', { max: 3 }],
    'max-depth': ['error', { max: 4 }],
    'id-length': [
      'error',
      {
        min: 3,
        properties: 'never',
        exceptions: ['_', 'ID', 'fp', 'fn', 'id', 'ip', 'os'],
      },
    ],
    'sonarjs/cognitive-complexity': 'error',
    'no-empty': 'error',
    'no-useless-catch': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
};
