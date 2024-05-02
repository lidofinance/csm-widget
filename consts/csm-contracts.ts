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
    CSAccounting: '0xBEbca4004679eA617bf955c9f007BC413Cf5b932',
    CSFeeDistributor: '0xA0544cfbBc649e1E6cfCA81557109B6E658c6358',
    CSFeeOracle: '0x6Eb17D5d1c47803eD2fc0B6dE8dA1Bc16D3EE3D1',
    CSModule: '0xceEE0fA590c7eA0d3c0bf61fD0228eC2d935d282',
    CSVerifier: '0x2531577B336a24fC1b8425e6E45bC87Cb0dB2E56',
    HashConsensus: '0x6cE1E4184AE7db16F14ae41862a631226CBD6DE5',
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
