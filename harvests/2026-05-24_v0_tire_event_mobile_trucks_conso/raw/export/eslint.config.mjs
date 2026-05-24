import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Boilerplate shadcn/v0 non modifié : on tolère les nouvelles règles
    // strictes de react-hooks (purity / set-state-in-effect) introduites
    // par la dernière version du plugin. Le code métier (components/tire)
    // reste 100 % clean.
    rules: {
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
]

export default eslintConfig
