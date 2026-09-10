import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

export type CspBuildOptions = {
  ipfsMode: boolean;
  developmentMode: boolean;
  trustedHosts: string[];
  reportUri?: string;
};

export type CspDirectives = Exclude<
  ContentSecurityPolicyOption,
  false
>['directives'];

export const WALLETCONNECT_HOSTS = [
  'https://*.walletconnect.org',
  'https://*.walletconnect.com',
] as const;

export const buildCspDirectives = ({
  ipfsMode,
  developmentMode,
  trustedHosts,
  reportUri,
}: CspBuildOptions): CspDirectives => ({
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
  childSrc: ["'self'", ...WALLETCONNECT_HOSTS],
  workerSrc: ["'none'"],
  'base-uri': ipfsMode ? undefined : ["'none'"],
});
