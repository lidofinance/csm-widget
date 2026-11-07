import { parseUrlList } from '../scripts/parse-url-list.mjs';
import { loadDevnetAddresses } from '../scripts/load-devnet-addresses.mjs';

// empty list still typed as the tuple; consumers throw on use
const urlList = (value?: string) =>
  parseUrlList(value) as [string, ...string[]];

export const readServerConfig = (
  env: Record<string, string | undefined> = process.env,
) => ({
  rpcUrls_1: urlList(env.EL_RPC_URLS_1),
  rpcUrls_560048: urlList(env.EL_RPC_URLS_560048),
  clApiUrls_1: urlList(env.CL_API_URLS_1),
  clApiUrls_560048: urlList(env.CL_API_URLS_560048),
  migalabsApiUrl: env.ETHSEER_API_URL,
  migalabsApiToken: env.ETHSEER_API_TOKEN,
  rateLimit: Number(env.RATE_LIMIT) || 100,
  rateLimitTimeFrame: Number(env.RATE_LIMIT_TIME_FRAME) || 60,
  validationAPI: env.VALIDATION_SERVICE_BASE_PATH,
  devnetAddresses: loadDevnetAddresses(env.DEVNET_ADDRESSES_FILE_PATH),
});

export type ServerConfig = ReturnType<typeof readServerConfig>;

let cached: ServerConfig | undefined;

/** Server-only; reads process.env on first call. */
export const getServerConfig = (): ServerConfig =>
  (cached ??= readServerConfig());
