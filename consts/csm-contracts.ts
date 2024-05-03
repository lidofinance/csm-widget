import { CHAINS } from '@lido-sdk/constants';
import { Address } from 'wagmi';

type CSMContract =
  | 'CSAccounting'
  | 'CSFeeDistributor'
  | 'CSFeeOracle'
  | 'CSModule'
  | 'CSVerifier'
  | 'HashConsensus';

export type ChainAddressMap = Partial<
  Record<CHAINS, Record<CSMContract, Address>>
>;

export const CONTRACTS_BY_NETWORK: ChainAddressMap = {
  [CHAINS.Mainnet]: {
    CSAccounting: '0x59c7D03d2E9893FB7bAa89dA50a9452e1e9B8b90',
    CSFeeDistributor: '0xFcCa971FE9Ee20C1Cf22596E700aA993D8fD19c5',
    CSFeeOracle: '0x8D75F9F7f4F4C4eFAB9402261bC864f21DF0c649',
    CSModule: '0x7A5EC257391817ef241ef8451642cC6b222d4f8C',
    CSVerifier: '0xCC5Bc84C3FDbcF262AaDD9F76652D6784293dD9e',
    HashConsensus: '0xfb6dAB6200b8958C2655C3747708F82243d3F32E',
  },
  [CHAINS.Holesky]: {
    CSAccounting: '0x9808a94167b30c2F71d2863dbdB8eD9B65ED1DBe',
    CSFeeDistributor: '0xFBb0158db5061343Cd130F04FDe71CA62DdBdE2D',
    CSFeeOracle: '0x0Ac2f7145200ce74eEb717C4e36076aC67f1D5E5',
    CSModule: '0xddB08564C699D5392a9E9a3C8E2Ab9D7C1949CB6',
    CSVerifier: '0x57A3807E89cfC10dA48e90D994b5dCa15d595ABb',
    HashConsensus: '0x8e1249fA85dfe4d6ecdCD56230F9c81Ede6D354a',
  },
};

export const getCSMContractAddress = (
  chainId: CHAINS,
  contract: CSMContract,
): Address => {
  const address = CONTRACTS_BY_NETWORK[chainId]?.[contract];
  if (address == null) {
    throw new Error(`Contract [${chainId}]:${contract} is not specified`);
  }

  return address;
};

export const getCSMContractAddressGetter =
  (contract: CSMContract) => (chainId: CHAINS) =>
    getCSMContractAddress(chainId, contract);
