import nx from '@nx/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'

import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  ...pluginQuery.configs['flat/recommended'],
  ...pluginRouter.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['**/core/env.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'MemberExpression[object.meta.name="import"][object.property.name="meta"][property.name="env"]',
          message:
            "Direct access to env vars is forbidden. Import { ENV } from '~/core/env' instead to ensure validated types.",
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'react/boolean-prop-naming': [
        'error',
        { rule: '^(is|has|as)[A-Z]([A-Za-z0-9]?)+' },
      ],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: ['arrow-function', 'function-declaration'],
        },
      ],
      'react/hook-use-state': ['error', { allowDestructuredState: true }],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-props-no-spread-multi': 'error',
      'react/no-this-in-sfc': 'error',
      'react/style-prop-object': 'error',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
]
