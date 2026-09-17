// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = require('pino'); // It's ok that pino is transit dependency, it's required by next-logger
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { satanizer, commonPatterns } = require('@lidofinance/satanizer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const loadEnvConfig = require('@next/env').loadEnvConfig;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clampArgs } = require('./utilsApi/clamp-log-args.cjs');

// Must load env first
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Secret env vars holding comma-separated URL lists (keys are embedded in the URLs).
// Prefix-scanned so new chain ids need no change here.
const URL_LIST_ENV_PREFIXES = ['EL_RPC_URLS_', 'CL_API_URLS_'];

// Comma-split so each URL becomes its own pattern; otherwise satanizer only
// matches the full concatenation, never a single URL as it appears in logs.
// Both the raw and trailing-slash-stripped forms are masked: satanizer matches
// literally, and `parseUrlList` in config/helpers.ts strips the trailing slash
// before the URL ever reaches a log line. Same applies to the single-URL envs
// VALIDATION_SERVICE_BASE_PATH and ETHSEER_API_URL below.
const urlVariants = (url) =>
  [url.trim(), url.trim().replace(/\/+$/, '')].filter(Boolean);

const urlListPatterns = [
  ...new Set(
    Object.entries(process.env)
      .filter(([key]) => URL_LIST_ENV_PREFIXES.some((p) => key.startsWith(p)))
      .flatMap(([, value]) => (value || '').split(',').flatMap(urlVariants)),
  ),
];

const patterns = [
  ...commonPatterns,
  ...urlListPatterns,
  ...urlVariants(process.env.VALIDATION_SERVICE_BASE_PATH || ''),
  ...urlVariants(process.env.ETHSEER_API_URL || ''),
  process.env.ETHSEER_API_TOKEN,
].filter(Boolean);
const mask = satanizer(patterns);

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    formatters: {
      ...defaultConfig.formatters,
      level(label, _number) {
        return { level: label };
      },
    },
    hooks: {
      // Cap arguments before masking — masking cost grows faster than linearly
      // with payload size. See utilsApi/clamp-log-args.cjs for the limits.
      logMethod(inputArgs, method) {
        return method.apply(this, mask(clampArgs(inputArgs)));
      },
    },
  });

module.exports = {
  logger,
};
