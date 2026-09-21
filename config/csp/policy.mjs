import { toBoolean } from '../../scripts/to-boolean.mjs';

export const WALLETCONNECT_HOSTS = [
  'https://*.walletconnect.org',
  'https://*.walletconnect.com',
];

/**
 * @typedef {{
 *   developmentMode: boolean,
 *   ipfsMode: boolean,
 *   trustedHosts: string[],
 *   reportUri: string | undefined,
 * }} CspBuildOptions
 */

/**
 * @param {CspBuildOptions} options
 * @returns {Exclude<import('next-secure-headers/lib/rules').ContentSecurityPolicyOption, false>['directives']}
 */
export const buildCspDirectives = ({
  developmentMode,
  ipfsMode,
  trustedHosts,
  reportUri,
}) => ({
  'default-src': ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  fontSrc: ["'self'", 'data:', 'https://fonts.reown.com'],
  imgSrc: ["'self'", 'data:', 'blob:'],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    // bls-eth-wasm (deposit-data BLS verification) → WebAssembly.instantiate
    "'wasm-unsafe-eval'",
    ...(developmentMode ? ["'unsafe-eval'"] : []), // HMR
    ...trustedHosts,
  ],
  // users may configure custom RPC endpoints
  connectSrc: [
    "'self'",
    'https:',
    'wss:',
    ...(developmentMode ? ['ws:'] : []), // HMR
  ],
  // ignored when delivered via <meta> (IPFS mode)
  ...(!ipfsMode && {
    frameAncestors: ['*'],
    reportURI: reportUri,
  }),
  // frame-src wins over child-src in modern browsers; child-src kept as fallback
  frameSrc: ["'self'", ...WALLETCONNECT_HOSTS],
  childSrc: ["'self'", ...WALLETCONNECT_HOSTS],
  workerSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  manifestSrc: ["'self'"],
  formAction: ["'self'"],
  'script-src-attr': ["'none'"],
  'base-uri': ipfsMode ? undefined : ["'none'"],
});

/**
 * @param {CspBuildOptions & { reportOnly: boolean }} options
 * @returns {import('next-secure-headers/lib/rules').ContentSecurityPolicyOption}
 */
export const buildContentSecurityPolicy = ({ reportOnly, ...options }) => ({
  directives: buildCspDirectives(options),
  reportOnly,
});

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{
 *   developmentMode: boolean,
 *   ipfsMode: boolean,
 *   trustedHosts: string[],
 *   reportUri: string | undefined,
 *   reportOnly: boolean,
 * }}
 */
export const cspOptionsFromEnv = (env) => ({
  developmentMode: env.NODE_ENV === 'development',
  ipfsMode: toBoolean(env.IPFS_MODE),
  trustedHosts: env.CSP_TRUSTED_HOSTS ? env.CSP_TRUSTED_HOSTS.split(',') : [],
  reportUri: env.CSP_REPORT_URI,
  reportOnly: toBoolean(env.CSP_REPORT_ONLY),
});
