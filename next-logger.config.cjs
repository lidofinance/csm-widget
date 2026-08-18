// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = require('pino'); // It's ok that pino is transit dependency, it's required by next-logger
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { satanizer, commonPatterns } = require('@lidofinance/satanizer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const loadEnvConfig = require('@next/env').loadEnvConfig;

// Must load env first
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Secret env vars holding comma-separated URL lists (keys are embedded in the URLs).
// Prefix-scanned so new chain ids need no change here.
const URL_LIST_ENV_PREFIXES = ['EL_RPC_URLS_', 'CL_API_URLS_'];

// Comma-split so each URL becomes its own pattern; otherwise satanizer only
// matches the full concatenation, never a single URL as it appears in logs.
const urlListPatterns = Object.entries(process.env)
  .filter(([key]) => URL_LIST_ENV_PREFIXES.some((p) => key.startsWith(p)))
  .flatMap(([, value]) =>
    (value || '')
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean),
  );

const patterns = [
  ...commonPatterns,
  ...urlListPatterns,
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
      logMethod(inputArgs, method) {
        return method.apply(this, mask(inputArgs));
      },
    },
  });

module.exports = {
  logger,
};
