import { parseDefaultChain, parseUrlList, toBoolean } from 'config/helpers';

// an empty list passes as the tuple; consumers fail on use, as before
const urlList = (value?: string) =>
  parseUrlList(value) as [string, ...string[]];

export const readServerConfig = (
  env: Record<string, string | undefined> = process.env,
) => ({
  maintenance: toBoolean(env.MAINTENANCE),
  defaultChain: parseDefaultChain(env.DEFAULT_CHAIN),
  rpcUrls_1: urlList(env.EL_RPC_URLS_1),
  rpcUrls_560048: urlList(env.EL_RPC_URLS_560048),
  clApiUrls_1: urlList(env.CL_API_URLS_1),
  clApiUrls_560048: urlList(env.CL_API_URLS_560048),
  migalabsApiUrl: env.ETHSEER_API_URL,
  migalabsApiToken: env.ETHSEER_API_TOKEN,
  cspTrustedHosts: env.CSP_TRUSTED_HOSTS,
  cspReportUri: env.CSP_REPORT_URI,
  cspReportOnly: toBoolean(env.CSP_REPORT_ONLY),
  rateLimit: Number(env.RATE_LIMIT) || 100,
  rateLimitTimeFrame: Number(env.RATE_LIMIT_TIME_FRAME) || 60,
  validationAPI: env.VALIDATION_SERVICE_BASE_PATH,
});

export type ServerConfig = ReturnType<typeof readServerConfig>;

let cached: ServerConfig | undefined;

/** Server-only; reads process.env on first call. */
export const getServerConfig = (): ServerConfig =>
  (cached ??= readServerConfig());
