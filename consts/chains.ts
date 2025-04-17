// TODO: rename to CHAIN
export const CHAINS = {
  Mainnet: 1,
  Holesky: 17000,
  Hoodi: 560048,
} as const;

type CHAINS_NAME = keyof typeof CHAINS;
export type CHAINS = (typeof CHAINS)[CHAINS_NAME];
