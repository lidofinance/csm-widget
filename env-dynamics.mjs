/**
 * Convert to bool:
 * - true to true
 * - 'true' to true
 * - 1 to true
 * - '1' to true
 * - another values to false
 * @returns {Boolean}
 */
const toBoolean = (dataStr) => {
  return !!(
    dataStr?.toLowerCase?.() === 'true' ||
    dataStr === true ||
    Number.parseInt(dataStr, 10) === 1
  );
};

/** @type string */
export const matomoHost = process.env.MATOMO_URL;
/** @type number */
export const defaultChain = parseInt(process.env.DEFAULT_CHAIN, 10) || 560048;
/** @type number[] */

export const supportedChains = process.env?.SUPPORTED_CHAINS?.split(',').map(
  (chainId) => parseInt(chainId, 10),
) ?? [560048];
/** @type string */
export const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;

/** @type boolean */
export const ipfsMode = toBoolean(process.env.IPFS_MODE);

/** @type string[] */
export const prefillUnsafeElRpcUrls1 =
  process.env.PREFILL_UNSAFE_EL_RPC_URLS_1?.split(',') ?? [];

/** @type string[] */
export const prefillUnsafeElRpcUrls17000 =
  process.env.PREFILL_UNSAFE_EL_RPC_URLS_17000?.split(',') ?? [];

/** @type string[] */
export const prefillUnsafeElRpcUrls560048 =
  process.env.PREFILL_UNSAFE_EL_RPC_URLS_560048?.split(',') ?? [];

/** @type string */
export const widgetApiBasePathForIpfs =
  process.env.WIDGET_API_BASE_PATH_FOR_IPFS;
