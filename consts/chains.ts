// TODO: rename to CHAIN
export const CHAINS = {
  Mainnet: 1,
  Holesky: 17000,
  Hoodi: 560048,
} as const;

export type ChainNames = keyof typeof CHAINS;
export type CHAINS = (typeof CHAINS)[ChainNames];

export const CHAIN_NAMES: Record<CHAINS, Capitalize<ChainNames>> = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Holesky]: 'Holesky',
  [CHAINS.Hoodi]: 'Hoodi',
};
