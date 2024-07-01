import { CHAINS } from '@lido-sdk/constants';

export const PUBKEY_LENGTH = 96;
export const SIGNATURE_LENGTH = 192;

export const FIXED_AMOUNT = 32000000000;

export const FIXED_WC_PREFIX = '010000000000000000000000';

export const FIXED_NETWORK: {
  [key in CHAINS]?: string[];
} = {
  [CHAINS.Goerli]: ['goerli', 'prater'],
  [CHAINS.Mainnet]: ['mainnet'],
  [CHAINS.Ropsten]: ['mainnet'],
  [CHAINS.Kiln]: ['kiln'],
  [CHAINS.Holesky]: ['holesky'],
};

export const FIXED_FORK_VERSION: {
  [key in CHAINS]?: string;
} = {
  [CHAINS.Goerli]: '00001020',
  [CHAINS.Mainnet]: '00000000',
  [CHAINS.Holesky]: '01017000',
  [CHAINS.Ropsten]: '00000000',
  [CHAINS.Kiln]: '70000069',
};
