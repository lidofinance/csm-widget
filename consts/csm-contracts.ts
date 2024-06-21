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
  // @note local mainnetish
  [CHAINS.Mainnet]: {
    CSAccounting: '0x64079a2Edd1104a2323E2b732A1244BCE011B1F5',
    CSEarlyAdoption: '0x4E76FbE44fa5Dae076a7f4f676250e7941421fbA',
    CSFeeDistributor: '0xFE92134da38df8c399A90a540f20187D19216E05',
    CSFeeOracle: '0xe24e7570Fe7207AdAaAa8c6c89a59850391B5276',
    CSModule: '0xA8d14b3d9e2589CEA8644BB0f67EB90d21079f8B',
    CSVerifier: '0x2e13f7644014F6E934E314F0371585845de7B986',
  },
  // @note devnet.1
  [CHAINS.Holesky]: {
    CSAccounting: '0x782c7c96959bE2258a7b67439435885b39946c9E',
    CSEarlyAdoption: '0xD281039D2CB4f04226a733a64d7Cf7dc75C85eFE',
    CSFeeDistributor: '0x9d678b6266B0312D0C04ab01156C6b83B26fc9e2',
    CSFeeOracle: '0xc50AEac9BC949eAcC3fe1D710DC705f3fE598413',
    CSModule: '0x26aBc20a47f7e8991F1d26Bf0fC2bE8f24E9eF2A',
    CSVerifier: '0x192104Da42816A615a43B9989fCbe75e06B97b98',
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
