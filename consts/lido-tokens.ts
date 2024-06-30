import { CHAINS } from '@lido-sdk/constants';
import { getTokenAddress as getBaseTokenAddress } from '@lido-sdk/constants';
import invariant from 'tiny-invariant';
import { Address } from 'wagmi';
import { TOKENS } from '@lido-sdk/constants';
import { config } from 'config';

type ChainAddressMap = Partial<
  Record<CHAINS, Partial<Record<TOKENS, Address>>>
>;

export const TOKENS_BY_NETWORK: ChainAddressMap = {
  // @note devnet.1
  [CHAINS.Holesky]:
    process.env.DEVNET || config.isDevnet
      ? {
          [TOKENS.WSTETH]: '0x6106cba64006ffdd869e10fd0bdad33393e230fd',
          [TOKENS.STETH]: '0x4e97Cc8B850f3CE6E06899A09141e9C5EC5eFD3F',
        }
      : undefined,
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
