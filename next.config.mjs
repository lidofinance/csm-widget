import generateBuildId from './scripts/generate-build-id.mjs';

// https://nextjs.org/docs/pages/api-reference/next-config-js/basePath
const basePath = process.env.BASE_PATH;

const moduleMode = (process.env.MODULE || 'csm').toUpperCase();
const moduleName = moduleMode.toLowerCase();

// cache control
export const CACHE_CONTROL_HEADER = 'x-cache-control';
export const CACHE_CONTROL_PAGES = [
  // documents — statically prerendered, same HTML for every visitor; uncovered
  // routes get Next's 1-year s-maxage, which outlives build chunk hashes
  '/',
  '/group',
  '/monitoring',
  '/operators',
  '/qa-config',
  '/wrapped-2025/:path*',
  '/bond/:path*',
  '/create/:path*',
  '/delayed-penalty/:path*',
  '/idvtc/:path*',
  '/keys/:path*',
  '/settings/:path*',
  '/top-up-allocation',
  '/surveys/:path*',
  '/type/:path*',
  '/test/:path*',
  // assets — unhashed, so they share the document TTL; header sources match
  // pre-rewrite paths, so module-variant files are listed too
  '/manifest.json',
  '/manifest-:module(csm|cm).json',
  '/favicon:suffix([-.a-z0-9]+)',
  '/apple-touch-icon.png',
  '/apple-touch-icon-:module(csm|cm).png',
  '/:module(csm|cm)-preview.png',
  '/runtime/window-env.js',
];
export const CACHE_CONTROL_VALUE =
  'public, max-age=15, s-maxage=30, stale-if-error=86400, stale-while-revalidate=60';

// devDependency, absent from the production image where this config is re-evaluated on boot
const withBundleAnalyzer = process.env.ANALYZE_BUNDLE
  ? // eslint-disable-next-line import/no-extraneous-dependencies
    (await import('@next/bundle-analyzer')).default({ enabled: true })
  : (config) => config;

export default withBundleAnalyzer({
  basePath,
  // re-evaluated on boot, so MODULE picks the matching build
  distDir: `.next/${moduleName}`,
  env: {
    MODULE: moduleMode,
    BASE_PATH: basePath ?? '',
  },
  generateBuildId,

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config) {
    const imageRule = config.module.rules.find(
      (rule) => rule?.loader === 'next-image-loader',
    );
    if (imageRule) imageRule.exclude = /\.svg$/i;

    config.module.rules.push(
      // `issuer` keeps both off SVGs referenced from CSS (e.g. @lidofinance/lido-shared-ui)
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /react/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: { overrides: { removeViewBox: false } },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/react/] },
        type: 'asset/resource',
        generator: { filename: 'static/media/[name].[hash:8][ext]' },
      },
    );

    // Fixes warning about missing dependency @react-native-async-storage/async-storage,
    // which comes from @metamask/connect-multichain and @walletconnect/keyvaluestorage
    // See https://github.com/MetaMask/metamask-sdk/issues/1376
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      // Tempo Accounts SDK, optional peer dep of @wagmi/connectors v8 reachable only via
      // @wagmi/core's unused `tempo` export; not installed, webpack resolves it eagerly
      accounts: false,
    };

    // Same unused `ox` tempo path: it builds an import specifier at runtime, which webpack
    // can only report as a critical dependency
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        module: /node_modules\/ox\/_esm\/tempo\//,
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Overwritten by Cloudflare; 1 year is the hstspreload.org minimum
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'Referrer-Policy', value: 'same-origin' },
          { key: 'x-content-type-options', value: 'nosniff' },
          { key: 'x-xss-protection', value: '1; mode=block' },
          { key: 'x-download-options', value: 'noopen' },
          { key: 'x-permitted-cross-domain-policies', value: 'none' },
          {
            key: 'cross-origin-opener-policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'accelerometer=()',
              'gyroscope=()',
              'magnetometer=()',
              'display-capture=()',
              'encrypted-media=()',
              'serial=()',
              'xr-spatial-tracking=()',
              'browsing-topics=()',
              // hardware wallets (Ledger/Trezor) via WebUSB/WebHID/Bluetooth
              'usb=(self)',
              'bluetooth=(self)',
              'hid=(self)',
              'autoplay=(self)',
              'fullscreen=(self)',
              'picture-in-picture=(self)',
            ].join(', '),
          },
        ],
      },
      {
        // required for gnosis save apps
        source: '/manifest:suffix(-[a-z]+)?.json',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      ...CACHE_CONTROL_PAGES.map((page) => ({
        source: page,
        headers: [{ key: CACHE_CONTROL_HEADER, value: CACHE_CONTROL_VALUE }],
      })),
    ];
  },
  // serves the module-specific assets shipped in public/ under the canonical
  // paths Gnosis Safe Apps and browsers expect (/manifest.json, /favicon.ico)
  async rewrites() {
    return [
      { source: '/manifest.json', destination: `/manifest-${moduleName}.json` },
      { source: '/favicon.ico', destination: `/favicon-${moduleName}.ico` },
      {
        source: '/favicon-:size(16x16|32x32|192x192|512x512).png',
        destination: `/favicon-${moduleName}-:size.png`,
      },
      {
        source: '/apple-touch-icon.png',
        destination: `/apple-touch-icon-${moduleName}.png`,
      },
    ];
  },
});
