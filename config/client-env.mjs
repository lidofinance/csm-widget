import { toBoolean } from '../scripts/to-boolean.mjs';

// Trailing `/` breaks some RPC providers (e.g. Infura)
const parseUrlList = (value) =>
  value
    ?.split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean) ?? [];

const UNSAFE_CHARS = /[<>&\u2028\u2029]/g;

/**
 * @typedef {{
 *   matomoHost: string;
 *   defaultChain: number;
 *   walletconnectProjectId: string;
 *   isTestEnv: boolean;
 *   maintenance: boolean;
 *   addressApiValidationEnabled: boolean;
 *   keysApiUrl: string;
 *   feesMonitoringApiUrl: string;
 *   surveysApiUrl: string;
 *   ipfsGateways: string[];
 *   devnetAddresses: Record<string, unknown> | null;
 * }} ClientEnv
 */

/**
 * Browser-visible config; server.mjs serves it as `window.__env__`.
 * @param {Record<string, string | undefined>} [env]
 * @param {{ devnetAddresses?: Record<string, unknown> | null }} [options]
 * @returns {ClientEnv}
 */
export const buildClientEnv = (
  env = process.env,
  { devnetAddresses = null } = {},
) => ({
  matomoHost: env.MATOMO_URL,
  defaultChain: parseInt(env.DEFAULT_CHAIN, 10) || 560048,
  walletconnectProjectId: env.WALLETCONNECT_PROJECT_ID,
  isTestEnv: !toBoolean(env.IS_PROD),
  maintenance: toBoolean(env.MAINTENANCE),
  addressApiValidationEnabled: !!env.VALIDATION_SERVICE_BASE_PATH,
  keysApiUrl: env.KEYS_API_URL,
  feesMonitoringApiUrl: env.FEES_MONITORING_API_URL,
  surveysApiUrl: env.SURVEYS_API_URL,
  ipfsGateways: parseUrlList(env.IPFS_GATEWAYS),
  devnetAddresses,
});

/**
 * JSON safe to inline in a script: no `</script>` breakout, no JS line terminators.
 * @param {ClientEnv} clientEnv
 * @returns {string}
 */
export const serializeClientEnv = (clientEnv) =>
  JSON.stringify(clientEnv).replace(
    UNSAFE_CHARS,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
