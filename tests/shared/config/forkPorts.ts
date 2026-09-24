import { fileURLToPath } from 'node:url';
import type { ChainName } from '../contracts/constants.ts';

const PORTS_FILE = fileURLToPath(new URL('../../../fork.env', import.meta.url));

process.loadEnvFile(PORTS_FILE);

const CI_PORT = 8545;

export const forkPort = (chain: ChainName): number => {
  if (process.env.CI) return CI_PORT;

  const name = `${chain}_PORT`.toUpperCase();
  const port = Number(process.env[name]);
  if (!port) throw new Error(`${name} is not set in fork.env`);
  return port;
};
