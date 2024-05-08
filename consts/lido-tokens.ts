import { CHAINS } from '@lido-sdk/constants';
import { getTokenAddress as getBaseTokenAddress } from '@lido-sdk/constants';
import invariant from 'tiny-invariant';
import { Address } from 'wagmi';
import { TOKENS } from '@lido-sdk/constants';

type ChainAddressMap = Partial<
  Record<CHAINS, Partial<Record<TOKENS, Address>>>
>;

export const TOKENS_BY_NETWORK: ChainAddressMap = {
  // @note devnet.0
  [CHAINS.Holesky]: {
    [TOKENS.WSTETH]: '0xF1e88F0E4258a46D5299f3D512e0fC9782Cca47d',
    [TOKENS.STETH]: '0xFfC41725C09407E4713FB4d02bc814c40ed15FD1',
  },
};

export const getTokenAddress = (chainId: CHAINS, token: TOKENS): string => {
  const tokens = TOKENS_BY_NETWORK[chainId];

  if (!tokens?.[token]) {
    return getBaseTokenAddress(chainId, token);
  }

  const address = tokens[token];
  invariant(address, 'Token is not supported');

  return address;
};
