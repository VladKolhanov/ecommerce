import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['**/env.module.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            "Use `import { EnvModule } from '@/core/env/env.module'` instead to ensure validated types.",
        },
      ],
    },
  },
]
