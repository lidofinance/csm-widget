import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

type ChainInfo = {
  name: string;
  color: string;
};

export const CHAIN_METADATA: Record<SUPPORTED_CHAINS, ChainInfo> = {
  [CHAINS.Mainnet]: { name: 'Mainnet', color: '#29b6af' },
  [CHAINS.Hoodi]: { name: 'Hoodi', color: '#AA346A' },
};
