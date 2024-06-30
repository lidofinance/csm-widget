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
  [CHAINS.Holesky]: process.env.DEVNET
    ? {
        CSAccounting: '0x782c7c96959bE2258a7b67439435885b39946c9E',
        CSEarlyAdoption: '0xD281039D2CB4f04226a733a64d7Cf7dc75C85eFE',
        CSFeeDistributor: '0x9d678b6266B0312D0C04ab01156C6b83B26fc9e2',
        CSFeeOracle: '0xc50AEac9BC949eAcC3fe1D710DC705f3fE598413',
        CSModule: '0x26aBc20a47f7e8991F1d26Bf0fC2bE8f24E9eF2A',
        CSVerifier: '0x192104Da42816A615a43B9989fCbe75e06B97b98',
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
