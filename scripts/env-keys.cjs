/**
 * @typedef {{
 *   key: string;
 *   secret?: true;
 *   optional?: true;
 *   chain?: '1' | '560048';
 *   requiredOn?: '1' | '560048';
 * }} EnvKey
 * `chain`: secret is only logged when DEFAULT_CHAIN matches.
 * `requiredOn`: optional unless DEFAULT_CHAIN matches.
 * @type {EnvKey[]}
 */
module.exports = [
  { key: 'BASE_PATH', optional: true },

  { key: 'DEFAULT_CHAIN' },

  { key: 'MAINTENANCE', optional: true },
  { key: 'IS_PROD', optional: true },

  { key: 'CSP_TRUSTED_HOSTS' },
  { key: 'CSP_REPORT_ONLY', optional: true },
  { key: 'CSP_REPORT_URI', optional: true },

  { key: 'RATE_LIMIT', optional: true },
  { key: 'RATE_LIMIT_TIME_FRAME', optional: true },

  { key: 'MATOMO_URL' },
  { key: 'WALLETCONNECT_PROJECT_ID' },

  { key: 'KEYS_API_URL', optional: true },
  { key: 'FEES_MONITORING_API_URL', optional: true },
  { key: 'IPFS_GATEWAYS', optional: true },
  { key: 'SURVEYS_API_URL', optional: true },

  { key: 'PREFILL_UNSAFE_EL_RPC_URLS_1', optional: true },
  { key: 'PREFILL_UNSAFE_EL_RPC_URLS_560048', optional: true },

  { key: 'VALIDATION_FILE_PATH', optional: true },
  { key: 'DEVNET_ADDRESSES_FILE_PATH', optional: true },

  { key: 'RUN_STARTUP_CHECKS', optional: true },
  { key: 'SHUTDOWN_DRAIN_MS', optional: true },

  // mainnet EL is proxied on every chain (ENS, ETH price); only mandatory on mainnet
  { key: 'EL_RPC_URLS_1', secret: true, requiredOn: '1' },
  { key: 'EL_RPC_URLS_560048', secret: true, chain: '560048' },
  { key: 'CL_API_URLS_1', secret: true, chain: '1' },
  { key: 'CL_API_URLS_560048', secret: true, chain: '560048' },
  { key: 'ETHSEER_API_URL', secret: true, chain: '1' },
  { key: 'ETHSEER_API_TOKEN', secret: true, chain: '1' },
  { key: 'VALIDATION_SERVICE_BASE_PATH', secret: true, optional: true },
];
