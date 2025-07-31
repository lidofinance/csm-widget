import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const CHAIN_NAMES = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Holesky]: 'Holesky',
  [CHAINS.Hoodi]: 'Hoodi',
} as const;

export type ChainNames = (typeof CHAIN_NAMES)[keyof typeof CHAIN_NAMES];

export const CHAINS_COLORS: Record<CSM_SUPPORTED_CHAINS, string> = {
  [CHAINS.Mainnet]: '#29b6af',
  [CHAINS.Holesky]: '#AA346A',
  [CHAINS.Hoodi]: '#AA346A',
};
