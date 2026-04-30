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
/** @type string */
export const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;

/** @type boolean */
export const ipfsMode = toBoolean(process.env.IPFS_MODE);

// Parse comma-separated URL list: trim whitespace, strip trailing slashes,
// drop empty entries. Trailing `/` breaks some RPC providers (e.g. Infura).
const parseUrlList = (val) =>
  val
    ?.split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean) ?? [];

/** @type string[] */
export const prefillUnsafeElRpcUrls1 = parseUrlList(
  process.env.PREFILL_UNSAFE_EL_RPC_URLS_1,
);

/** @type string[] */
export const prefillUnsafeElRpcUrls560048 = parseUrlList(
  process.env.PREFILL_UNSAFE_EL_RPC_URLS_560048,
);

/** @type string */
export const widgetApiBasePathForIpfs =
  process.env.WIDGET_API_BASE_PATH_FOR_IPFS;

/** @type boolean */
export const addressApiValidationEnabled =
  !!process.env.VALIDATION_SERVICE_BASE_PATH;

/** @type string */
export const validationFilePath = process.env.VALIDATION_FILE_PATH;

/** @type string */
export const keysApiUrl = process.env.KEYS_API_URL;

/** @type string */
export const feesMonitoringApiUrl = process.env.FEES_MONITORING_API_URL;
