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
  // @note devnet.0
  [CHAINS.Holesky]: {
    CSAccounting: '0x9808a94167b30c2F71d2863dbdB8eD9B65ED1DBe',
    CSEarlyAdoption: '0x0000000000000000000000000000000000000000',
    CSFeeDistributor: '0xFBb0158db5061343Cd130F04FDe71CA62DdBdE2D',
    CSFeeOracle: '0x0Ac2f7145200ce74eEb717C4e36076aC67f1D5E5',
    CSModule: '0xddB08564C699D5392a9E9a3C8E2Ab9D7C1949CB6',
    CSVerifier: '0x57A3807E89cfC10dA48e90D994b5dCa15d595ABb',
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
