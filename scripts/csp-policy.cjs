const WALLETCONNECT_HOSTS = [
  'https://*.walletconnect.org',
  'https://*.walletconnect.com',
];

/**
 * @typedef {{
 *   developmentMode: boolean,
 *   trustedHosts: string[],
 *   reportUri: string | undefined,
 * }} CspBuildOptions
 */

/**
 * @param {CspBuildOptions} options
 * @returns {Exclude<import('next-secure-headers/lib/rules').ContentSecurityPolicyOption, false>['directives']}
 */
const buildCspDirectives = ({ developmentMode, trustedHosts, reportUri }) => ({
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
  frameAncestors: ['*'],
  reportURI: reportUri,
  // frame-src wins over child-src in modern browsers; child-src kept as fallback
  frameSrc: ["'self'", ...WALLETCONNECT_HOSTS],
  childSrc: ["'self'", ...WALLETCONNECT_HOSTS],
  workerSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  manifestSrc: ["'self'"],
  formAction: ["'self'"],
  'script-src-attr': ["'none'"],
  'base-uri': ["'none'"],
});

/**
 * @param {CspBuildOptions & { reportOnly: boolean }} options
 * @returns {import('next-secure-headers/lib/rules').ContentSecurityPolicyOption}
 */
const buildContentSecurityPolicy = ({ reportOnly, ...options }) => ({
  directives: buildCspDirectives(options),
  reportOnly,
});

module.exports = {
  WALLETCONNECT_HOSTS,
  buildCspDirectives,
  buildContentSecurityPolicy,
};
