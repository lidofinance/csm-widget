import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const pkg = createRequire(import.meta.url)('./package.json');
const breakpoints = fileURLToPath(
  new URL(
    'node_modules/@lidofinance/lido-app-ui/dist/styles/breakpoints.css',
    import.meta.url,
  ),
);

// A custom config drops Next's default plugins, so the last two re-add them with Next's own options
export default {
  plugins: {
    '@csstools/postcss-global-data': { files: [breakpoints] },
    'postcss-custom-media': {},
    'postcss-nested': {},
    'next/dist/compiled/postcss-flexbugs-fixes': {},
    'next/dist/compiled/postcss-preset-env': {
      browsers: pkg.browserslist,
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: { 'custom-properties': false },
    },
  },
};
