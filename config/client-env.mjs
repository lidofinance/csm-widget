import { parseUrlList } from '../scripts/parse-url-list.mjs';
import { toBoolean } from '../scripts/to-boolean.mjs';

export const DEFAULT_CHAIN = 560048;

const UNSAFE_CHARS = /[<>&\u2028\u2029]/g;

/**
 * @typedef {{
 *   matomoHost: string | undefined;
 *   defaultChain: number;
 *   walletconnectProjectId: string | undefined;
 *   isTestEnv: boolean;
 *   maintenance: boolean;
 *   addressValidationEnabled: boolean;
 *   keysApiUrl: string | undefined;
 *   feesMonitoringApiUrl: string | undefined;
 *   surveysApiUrl: string | undefined;
 *   ipfsGateways: string[];
 *   devnetArtifacts: import('../scripts/load-devnet-artifacts.mjs').DevnetArtifactsEntry[] | null;
 * }} ClientEnv
 */

/**
 * Browser-visible config; server.mjs serves it as `window.__env__`.
 * @param {Record<string, string | undefined>} [env]
 * @param {{ devnetArtifacts?: ClientEnv['devnetArtifacts'] }} [options]
 * @returns {ClientEnv}
 */
export const buildClientEnv = (
  env = process.env,
  { devnetArtifacts = null } = {},
) => ({
  matomoHost: env.MATOMO_URL,
  defaultChain: parseInt(env.DEFAULT_CHAIN, 10) || DEFAULT_CHAIN,
  walletconnectProjectId: env.WALLETCONNECT_PROJECT_ID,
  isTestEnv: !toBoolean(env.IS_PROD),
  maintenance: toBoolean(env.MAINTENANCE),
  addressValidationEnabled:
    !!env.VALIDATION_SERVICE_BASE_PATH || !!env.VALIDATION_FILE_PATH,
  keysApiUrl: env.KEYS_API_URL,
  feesMonitoringApiUrl: env.FEES_MONITORING_API_URL,
  surveysApiUrl: env.SURVEYS_API_URL,
  ipfsGateways: parseUrlList(env.IPFS_GATEWAYS),
  devnetArtifacts,
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
