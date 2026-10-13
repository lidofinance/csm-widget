/* eslint-disable no-console */
import envKeys from './env-keys.cjs';
import { toBoolean } from './to-boolean.mjs';

const logMissing = (key, optional, prefix = '') => {
  if (optional) {
    console.info(`${prefix}${key} - not set (optional)`);
  } else {
    console.error(`${prefix}${key} - ERROR (not exist in process.env)`);
  }
};

export const logOpenEnvironmentVariables = () => {
  console.log('---------------------------------------------');
  console.log('Log environment variables (without secrets):');
  console.log('---------------------------------------------');

  for (const { key, optional } of envKeys.filter(({ secret }) => !secret)) {
    if (!(key in process.env)) {
      logMissing(key, optional);
      continue;
    }

    console.info(`${key} = ${process.env[key]}`);
  }

  console.log('---------------------------------------------');
  console.log('');
};

export const logSecretEnvironmentVariables = () => {
  console.log('---------------------------------------------');
  console.log('Log secret environment variables:');
  console.log('---------------------------------------------');

  const defaultChain = process.env['DEFAULT_CHAIN']?.trim();
  if (!defaultChain) {
    console.warn('DEFAULT_CHAIN is not defined in process.env!');
    console.warn('Skip the logSecretEnvironmentVariables check!');
    return;
  }

  for (const { key, optional, chain, requiredOn } of envKeys.filter(
    ({ secret }) => secret,
  )) {
    if (chain && chain !== defaultChain) {
      console.info(`Secret ${key} - skipped (only for DEFAULT_CHAIN=${chain})`);
      continue;
    }

    if (!(key in process.env)) {
      logMissing(
        key,
        optional || (requiredOn !== undefined && requiredOn !== defaultChain),
        'Secret ',
      );
      continue;
    }

    if (process.env[key].length > 0) {
      console.info(`Secret ${key} - OK (exist and not empty)`);
    } else {
      console.warn(`Secret ${key} - WARN (exist but empty)`);
    }
  }

  console.log('---------------------------------------------');
};

export const logEnvironmentVariables = () => {
  logOpenEnvironmentVariables();

  if (toBoolean(process.env.RUN_SECRET_ENV_LOGGING)) {
    logSecretEnvironmentVariables();
  }
};
