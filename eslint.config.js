// @ts-check
const ionic = require('@ionic/eslint-config/recommended');
const angular = require('angular-eslint');
const { defineConfig } = require('eslint/config');
const boundaries = require('eslint-plugin-boundaries');

/**
 * Architecture layers (see docs/ARCHITECTURE.md).
 * Patterns are folder suffixes; `feature` captures the feature name so rules
 * can tell "same feature" from "another feature".
 */
const ELEMENTS = [
  { type: 'core', pattern: 'app/core' },
  { type: 'layout', pattern: 'app/layout' },
  { type: 'shared-util', pattern: 'app/shared/utils' },
  { type: 'atom', pattern: 'app/shared/ui/atoms' },
  { type: 'molecule', pattern: 'app/shared/ui/molecules' },
  { type: 'template', pattern: 'app/shared/ui/templates' },
  { type: 'domain', pattern: 'app/features/*/domain', capture: ['feature'] },
  { type: 'data', pattern: 'app/features/*/data', capture: ['feature'] },
  { type: 'state', pattern: 'app/features/*/state', capture: ['feature'] },
  { type: 'organism', pattern: 'app/features/*/ui/organisms', capture: ['feature'] },
  { type: 'page', pattern: 'app/features/*/ui/pages', capture: ['feature'] },
];

const to = (...types) => ({ to: { element: { types: { anyOf: types } } } });
const toSameFeature = (...types) => ({
  to: {
    element: {
      types: { anyOf: types },
      captured: { feature: '{{ from.element.captured.feature }}' },
    },
  },
});

/** Who may import whom. Anything not listed here is an error. */
const POLICIES = [
  { from: { element: { type: 'core' } }, allow: [to('core', 'shared-util')] },
  {
    from: { element: { type: 'layout' } },
    allow: [to('core', 'shared-util', 'atom', 'molecule', 'template')],
  },
  { from: { element: { type: 'shared-util' } }, allow: [to('shared-util')] },
  { from: { element: { type: 'atom' } }, allow: [to('atom', 'shared-util')] },
  { from: { element: { type: 'molecule' } }, allow: [to('atom', 'molecule', 'shared-util')] },
  {
    from: { element: { type: 'template' } },
    allow: [to('atom', 'molecule', 'template', 'shared-util')],
  },
  { from: { element: { type: 'domain' } }, allow: [to('shared-util'), toSameFeature('domain')] },
  {
    from: { element: { type: 'data' } },
    allow: [to('core', 'shared-util'), toSameFeature('domain', 'data')],
  },
  {
    // A store may coordinate with another feature's store (e.g. deleting a category).
    from: { element: { type: 'state' } },
    allow: [to('core', 'shared-util', 'state'), toSameFeature('domain', 'data')],
  },
  {
    // Organisms are presentational: they render domain models but never inject state.
    from: { element: { type: 'organism' } },
    allow: [to('domain', 'atom', 'molecule', 'shared-util'), toSameFeature('organism')],
  },
  {
    // Pages are the only containers: they wire state into presentational components.
    from: { element: { type: 'page' } },
    allow: [
      to('core', 'shared-util', 'state', 'domain', 'atom', 'molecule', 'template'),
      toSameFeature('organism'),
    ],
  },
];

module.exports = defineConfig([
  {
    ignores: ['www/**', 'dist/**', 'coverage/**', '.angular/**', 'android/**', 'ios/**'],
  },
  ionic,
  {
    files: ['**/*.ts'],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Page', 'Component'],
        },
      ],
    },
  },
  {
    files: ['src/**/*.ts'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
      // Path aliases are our own code: group them after third-party imports.
      'import-x/internal-regex': '^@(core|shared|features|layout|testing|assets)/',
      'boundaries/elements': ELEMENTS,
    },
    rules: {
      'boundaries/dependencies': ['error', { default: 'disallow', policies: POLICIES }],
      // Use path aliases (@core/..., @features/...) instead of '../'; './' (same folder) is fine.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use a path alias (@core, @shared, @features, @layout, @testing, @assets).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
