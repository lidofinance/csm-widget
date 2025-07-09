import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const TRIM_LENGTH = 6;

export const PUBKEY_LENGTH = 96;
export const SIGNATURE_LENGTH = 192;

export const FIXED_AMOUNT = 32000000000;

export const FIXED_WC_PREFIX = '010000000000000000000000';

export const FIXED_NETWORK: {
  [key in CSM_SUPPORTED_CHAINS]?: string[];
} = {
  [CHAINS.Mainnet]: ['mainnet'],
  [CHAINS.Holesky]: ['holesky'],
  [CHAINS.Hoodi]: ['hoodi'],
};

export const FIXED_FORK_VERSION: {
  [key in CSM_SUPPORTED_CHAINS]?: string;
} = {
  [CHAINS.Mainnet]: '00000000',
  [CHAINS.Holesky]: '01017000',
  [CHAINS.Hoodi]: '10000910',
};
