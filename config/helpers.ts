import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

export type Modify<T, R> = Omit<T, keyof R> & R;

// Keep fallback as in 'env-dynamics.mjs' (Hoodi)
const FALLBACK_CHAIN = 560048 as SUPPORTED_CHAINS;

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

export const toBoolean = (val: any) => {
  return (
    val?.toLowerCase?.() === 'true' ||
    val === true ||
    Number.parseInt(val, 10) === 1
  );
};

// Parse a comma-separated list of URLs, trimming whitespace and stripping
// trailing slashes. Some RPC/CL providers reject requests to paths ending in
// `/` even though the URL is visually identical.
export const parseUrlList = (val?: string): string[] =>
  val
    ?.split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean) ?? [];
