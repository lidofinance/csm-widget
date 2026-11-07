import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('.', import.meta.url));

// tsconfig `baseUrl: '.'` bare imports
const BARE_ROOTS = [
  'abi',
  'assets',
  'build-info.json',
  'config',
  'consts',
  'faq',
  'features',
  'mock',
  'modules',
  'providers',
  'shared',
  'styles',
  'types',
  'utils',
  'utilsApi',
];

// svgr is a webpack loader; unit tests only need a component-shaped default export
const svgReactStub = {
  name: 'svg-react-stub',
  enforce: 'pre',
  load: (id) =>
    id.endsWith('.svg?react') ? 'export default () => null;' : null,
};

export default defineConfig({
  plugins: [react(), svgReactStub],
  resolve: {
    alias: BARE_ROOTS.map((find) => ({ find, replacement: root + find })),
  },
  test: {
    globals: true,
    env: { MODULE: 'CSM' },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      ...configDefaults.exclude,
      'tests/**',
      '.next/**',
      'lido-csm-sdk/**',
    ],
  },
});
