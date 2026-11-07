import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

// svgr is a webpack loader; unit tests only need a component-shaped default export
const svgReactStub = {
  name: 'svg-react-stub',
  enforce: 'pre',
  load: (id) =>
    id.endsWith('.svg?react') ? 'export default () => null;' : null,
};

export default defineConfig({
  plugins: [react(), svgReactStub],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    env: { MODULE: 'CSM' },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [...configDefaults.exclude, 'tests/**', '.next/**'],
  },
});
