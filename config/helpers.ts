import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

import { DEFAULT_CHAIN } from './client-env.mjs';

const FALLBACK_CHAIN = DEFAULT_CHAIN as SUPPORTED_CHAINS;

// An unsupported DEFAULT_CHAIN crashes per-chain SDK lookups
// (e.g. CURVE_ID_OPERATOR_TYPE[chainId][module]) on nearly every render,
// so validate at parse time and fall back to Hoodi
export const parseDefaultChain = (val: unknown): SUPPORTED_CHAINS => {
  const parsed = Number(val) || FALLBACK_CHAIN;
  if ((SUPPORTED_CHAINS as readonly number[]).includes(parsed)) {
    return parsed as SUPPORTED_CHAINS;
  }
  console.error(
    `[config] Unsupported defaultChain "${String(val)}", falling back to ${FALLBACK_CHAIN} (Hoodi). Supported chains: ${SUPPORTED_CHAINS.join(', ')}`,
  );
  return FALLBACK_CHAIN;
};
