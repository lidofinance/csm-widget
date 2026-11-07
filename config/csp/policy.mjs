import { parseUrlList } from '../../scripts/parse-url-list.mjs';
import { toBoolean } from '../../scripts/to-boolean.mjs';

const WALLETCONNECT_HOSTS = [
  'https://*.walletconnect.org',
  'https://*.walletconnect.com',
];

/**
 * Key order is header order (e2e securityHeaders specs compare byte-exact).
 * @param {{ trustedHosts: string[], reportUri?: string }} options
 * @returns {Record<string, string[]>}
 */
export const buildCspDirectives = ({ trustedHosts, reportUri }) => ({
  'default-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'font-src': ["'self'", 'data:', 'https://fonts.reown.com'],
  'img-src': ["'self'", 'data:', 'blob:'],
  // wasm-unsafe-eval: bls-eth-wasm (deposit-data BLS verification)
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'wasm-unsafe-eval'",
    ...trustedHosts,
  ],
  // users may configure custom RPC endpoints
  'connect-src': ["'self'", 'https:', 'wss:'],
  // frame-src wins over child-src in modern browsers; child-src is the fallback
  'frame-src': ["'self'", ...WALLETCONNECT_HOSTS],
  'child-src': ["'self'", ...WALLETCONNECT_HOSTS],
  'worker-src': ["'none'"],
  'object-src': ["'none'"],
  'media-src': ["'none'"],
  'manifest-src': ["'self'"],
  'script-src-attr': ["'none'"],
  'base-uri': ["'none'"],
  'form-action': ["'self'"],
  'frame-ancestors': ['*'],
  ...(reportUri && { 'report-uri': [encodeURI(reportUri)] }),
});

/** @param {Record<string, string[]>} directives */
export const serializeCsp = (directives) =>
  Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(' ')}`)
    .join('; ');

/**
 * @param {{ trustedHosts?: string, reportUri?: string, reportOnly?: string }} env raw CSP_* values
 * @returns {{ name: string, value: string }}
 */
export const buildCspHeader = ({ trustedHosts, reportUri, reportOnly }) => ({
  name: toBoolean(reportOnly)
    ? 'Content-Security-Policy-Report-Only'
    : 'Content-Security-Policy',
  value: serializeCsp(
    buildCspDirectives({
      trustedHosts: parseUrlList(trustedHosts),
      reportUri,
    }),
  ),
});
