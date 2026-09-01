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

const patterns = [
  ...commonPatterns,
  process.env.INFURA_API_KEY,
  process.env.ALCHEMY_API_KEY,
  process.env.ETHPLORER_API_KEY,
  // TODO: Delete this ENV
  process.env.CLOUDFLARE_API_TOKEN,
  process.env.CLOUDFLARE_ACCOUNT_ID,
  process.env.CLOUDFLARE_KV_NAMESPACE_ID,
];
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
