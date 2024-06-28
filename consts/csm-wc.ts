import { CHAINS } from '@lido-sdk/constants';
import { Address } from 'wagmi';

export type ChainTreeWcMap = Partial<Record<CHAINS, Address>>;

export const WC_BY_NETWORK: ChainTreeWcMap = {
  [CHAINS.Mainnet]: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
  // [CHAINS.Holesky]: '0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9',
  // @note not devnet.1
  [CHAINS.Holesky]: '0x285fa3Cac35761d183FFff76cBd9776327FC3D49',
};

export const getCsmWc = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return WC_BY_NETWORK[chainId];
};
