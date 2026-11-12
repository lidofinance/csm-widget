import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import {
  CL_STATUS,
  type ClKeyStatus,
  type ClStates,
} from '../../shared/helpers/clMockResponse.ts';

// The statuses the CL mock answers with, kept in cl-mock.json: `yarn cl-mock`
// and the QA panel both read and write them

const FILE = 'cl-mock.json';
const CHAIN_IDS: Record<string, number> = { hoodi: 560048, mainnet: 1 };

export const isClStatus = (status: string): status is ClKeyStatus =>
  status in CL_STATUS;

export const readClStates = (): ClStates =>
  existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};

export const writeClStates = (states: ClStates) =>
  writeFileSync(FILE, `${JSON.stringify(states, null, 2)}\n`);

/** The real CL the mock asks about pubkeys it has no status for */
export const clUpstream = (chain: string) =>
  process.env[`CL_API_URLS_${CHAIN_IDS[chain]}`]?.split(',')[0].trim();
