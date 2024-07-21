import { CHAINS } from '@lido-sdk/constants';
import { config } from 'config';
import { Address } from 'wagmi';

type CSMContract =
  | 'CSAccounting'
  | 'CSEarlyAdoption'
  | 'CSFeeDistributor'
  | 'CSFeeOracle'
  | 'CSModule'
  | 'CSVerifier';

export type ChainAddressMap = Partial<
  Record<CHAINS, Record<CSMContract, Address>>
>;

export const CONTRACTS_BY_NETWORK: ChainAddressMap = {
  [CHAINS.Mainnet]: undefined,
  // @note devnet.1
  [CHAINS.Holesky]:
    process.env.DEVNET || config.isDevnet
      ? {
          CSAccounting: '0xDDa0648FA8c9cD593416EC37089C2a2E6060B45c',
          CSEarlyAdoption: '0xCa57C1d3c2c35E667745448Fef8407dd25487ff8',
          CSFeeDistributor: '0x6A47346e722937B60Df7a1149168c0E76DD6520f',
          CSFeeOracle: '0xc6B407503dE64956Ad3cF5Ab112cA4f56AA13517',
          CSModule: '0x90b97E83e22AFa2e6A96b3549A0E495D5Bae61aF',
          CSVerifier: '0x7A28cf37763279F774916b85b5ef8b64AB421f79',
        }
      : {
          CSAccounting: '0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1',
          CSEarlyAdoption: '0x71E92eA77C198a770d9f33A03277DbeB99989660',
          CSFeeDistributor: '0xD7ba648C8F72669C6aE649648B516ec03D07c8ED',
          CSFeeOracle: '0xaF57326C7d513085051b50912D51809ECC5d98Ee',
          CSModule: '0x4562c3e63c2e586cD1651B958C22F88135aCAd4f',
          CSVerifier: '0x6DcA479178E6Ae41CCEB72a88FfDaa3e10E83CB7',
        },
};

export const getCSMContractAddress = (
  chainId: CHAINS | undefined = config.defaultChain,
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
