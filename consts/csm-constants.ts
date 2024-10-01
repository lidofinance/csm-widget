import { CHAINS } from '@lido-sdk/constants';
import { config } from 'config';
import { HexString } from 'shared/keys';
import { Address } from 'wagmi';

type CsmContract =
  | 'CSAccounting'
  | 'CSEarlyAdoption'
  | 'CSFeeDistributor'
  | 'CSFeeOracle'
  | 'CSModule'
  | 'CSVerifier'
  | 'ExitBusOracle';

type CsmConstants = {
  contracts: Record<CsmContract, Address>;
  deploymentBlockNumber: HexString;
  stakingModuleId: number;
  withdrawalCredentials: Address;
  earlyAdoptionMaxKeys: number;
  retentionPeriodMins: number;
};

export const CONSTANTS_BY_NETWORK: Partial<Record<CHAINS, CsmConstants>> = {
  [CHAINS.Mainnet]: undefined,
  [CHAINS.Holesky]: {
    contracts: {
      CSAccounting: '0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1',
      CSEarlyAdoption: '0x71E92eA77C198a770d9f33A03277DbeB99989660',
      CSFeeDistributor: '0xD7ba648C8F72669C6aE649648B516ec03D07c8ED',
      CSFeeOracle: '0xaF57326C7d513085051b50912D51809ECC5d98Ee',
      CSModule: '0x4562c3e63c2e586cD1651B958C22F88135aCAd4f',
      CSVerifier: '0x6DcA479178E6Ae41CCEB72a88FfDaa3e10E83CB7',
      ExitBusOracle: '0xffDDF7025410412deaa05E3E1cE68FE53208afcb',
    },
    deploymentBlockNumber: '0x1b143a',
    stakingModuleId: 4,
    withdrawalCredentials: '0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9',
    earlyAdoptionMaxKeys: 10,
    retentionPeriodMins: 80_640, // 8 weeks
  },
};

export const getCsmConstants = (
  chainId: CHAINS | undefined = config.defaultChain,
) => {
  const constants = CONSTANTS_BY_NETWORK[chainId];
  if (!constants) {
    throw new Error(`CSM constants for chain [${chainId}] are not specified`);
  }
  return constants;
};

export const getCsmContractAddress = (
  chainId: CHAINS | undefined,
  contract: CsmContract,
): Address => getCsmConstants(chainId).contracts[contract];

export const getCsmContractAddressGetter =
  (contract: CsmContract) => (chainId: CHAINS | undefined) =>
    getCsmContractAddress(chainId, contract);
