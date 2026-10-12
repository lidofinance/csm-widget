import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { skipIf, test } from './test.fixture';

const WIDGET_PAGES = [
  '/',
  '/create',
  '/group',
  '/keys/submit',
  '/keys/view',
  '/bond',
  '/bond/add',
  '/bond/claim',
  '/settings',
  '/settings/metadata',
  '/settings/splits',
  '/monitoring',
];

const PERMISSIONS_POLICY_VALUE =
  'camera=(), microphone=(), geolocation=(), payment=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=(), encrypted-media=(), serial=(), xr-spatial-tracking=(), browsing-topics=(), usb=(self), bluetooth=(self), hid=(self), autoplay=(self), fullscreen=(self), picture-in-picture=(self)';

const PAGE_CACHE_CONTROL_VALUE =
  'public, max-age=15, s-maxage=30, stale-if-error=86400, stale-while-revalidate=60';

// testnet and preview serve the policy in report-only mode (CSP_REPORT_ONLY)
const STAND_HEADERS: Record<string, { cspHeader: string; csp: string }> = {
  prod: {
    cspHeader: 'content-security-policy',
    csp: "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.reown.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.lido.fi; connect-src 'self' https: wss:; frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com; child-src 'self' https://*.walletconnect.org https://*.walletconnect.com; worker-src 'none'; object-src 'none'; media-src 'none'; manifest-src 'self'; script-src-attr 'none'; base-uri 'none'; form-action 'self'; frame-ancestors *; report-uri https://cm.lido.fi/api/csp-report",
  },
  staging: {
    cspHeader: 'content-security-policy',
    csp: "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.reown.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.infra-staging.org; connect-src 'self' https: wss:; frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com; child-src 'self' https://*.walletconnect.org https://*.walletconnect.com; worker-src 'none'; object-src 'none'; media-src 'none'; manifest-src 'self'; script-src-attr 'none'; base-uri 'none'; form-action 'self'; frame-ancestors *; report-uri https://cm.infra-staging.org/api/csp-report",
  },
  testnet: {
    cspHeader: 'content-security-policy-report-only',
    csp: "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.reown.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.testnet.fi; connect-src 'self' https: wss:; frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com; child-src 'self' https://*.walletconnect.org https://*.walletconnect.com; worker-src 'none'; object-src 'none'; media-src 'none'; manifest-src 'self'; script-src-attr 'none'; base-uri 'none'; form-action 'self'; frame-ancestors *; report-uri https://cm.testnet.fi/api/csp-report",
  },
  preview: {
    cspHeader: 'content-security-policy-report-only',
    csp: "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.reown.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.branch-preview.org; connect-src 'self' https: wss:; frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com; child-src 'self' https://*.walletconnect.org https://*.walletconnect.com; worker-src 'none'; object-src 'none'; media-src 'none'; manifest-src 'self'; script-src-attr 'none'; base-uri 'none'; form-action 'self'; frame-ancestors *; report-uri https://cm.testnet.fi/api/csp-report",
  },
};

// PreviewConfig keeps standType 'testnet', so the env value tells preview apart
const expected = STAND_HEADERS[process.env.STAND_TYPE ?? ''];

test.describe(
  ...suite({
    epic: EPIC.common,
    story: 'Security headers',
  }),
  () => {
    test(
      'Should serve security headers on widget pages',
      {
        ...skipIf(!expected, 'Local stand runs in dev mode with its own CSP'),
      },
      async ({ request }) => {
        for (const route of WIDGET_PAGES) {
          await test.step(`Check headers on ${route}`, async () => {
            const resp = await request.get(route);
            expect(resp.status(), `Status of ${route}`).toBe(200);
            const headers = resp.headers();

            expect
              .soft(headers['cache-control'], route)
              .toBe(PAGE_CACHE_CONTROL_VALUE);
            expect.soft(headers['referrer-policy'], route).toBe('same-origin');
            expect
              .soft(headers['x-content-type-options'], route)
              .toBe('nosniff');
            expect
              .soft(headers['x-xss-protection'], route)
              .toBe('1; mode=block');
            expect.soft(headers['x-dns-prefetch-control'], route).toBe('on');
            expect.soft(headers['x-download-options'], route).toBe('noopen');
            expect
              .soft(headers['x-permitted-cross-domain-policies'], route)
              .toBe('none');
            expect
              .soft(headers['permissions-policy'], route)
              .toBe(PERMISSIONS_POLICY_VALUE);
            expect
              .soft(headers['cross-origin-opener-policy'], route)
              .toBe('same-origin-allow-popups');
            // the app sends max-age=31536000, the infra overrides it
            expect
              .soft(headers['strict-transport-security'], route)
              .toBe('max-age=2592000; includeSubDomains; preload');
            expect.soft(headers[expected.cspHeader], route).toBe(expected.csp);
          });
        }
      },
    );
  },
);
