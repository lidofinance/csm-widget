import { CHAINS } from 'consts/chains';
import { CHAINS as ALL_CHAINS } from '@lido-sdk/constants';
import { config } from 'config';
import { HexString } from 'shared/keys';
import { Address } from 'wagmi';

export const KEYS_UPLOAD_TX_LIMIT = 25;

type CsmContract =
  | 'CSAccounting'
  | 'CSEarlyAdoption'
  | 'CSFeeDistributor'
  | 'CSFeeOracle'
  | 'CSModule'
  | 'CSVerifier'
  | 'ExitBusOracle'
  | 'StakingRouter';

type CsmConstants = {
  contracts: Record<CsmContract, Address>;
  deploymentBlockNumber?: HexString;
  stakingModuleId: number;
  withdrawalCredentials: Address;
  retentionPeriodMins: number;
  slotsPerFrame: number;
};

export const CONSTANTS_BY_NETWORK: Record<CHAINS, CsmConstants> = {
  [CHAINS.Mainnet]: {
    contracts: {
      CSAccounting: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
      CSEarlyAdoption: '0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E',
      CSFeeDistributor: '0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0',
      CSFeeOracle: '0x4D4074628678Bd302921c20573EEa1ed38DdF7FB',
      CSModule: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
      CSVerifier: '0x3Dfc50f22aCA652a0a6F28a0F892ab62074b5583',
      ExitBusOracle: '0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e',
      StakingRouter: '0xFdDf38947aFB03C621C71b06C9C70bce73f12999',
    },
    deploymentBlockNumber: '0x13f7326',
    stakingModuleId: 3,
    withdrawalCredentials: '0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f',
    retentionPeriodMins: 80_640, // 8 weeks
    slotsPerFrame: 32 * 225 * 28, // 28 days
  },
  [CHAINS.Hoodi]: {
    contracts: {
      CSAccounting: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
      CSEarlyAdoption: '0x3281b9E45518F462E594697f8fba1896a8B43939',
      CSFeeDistributor: '0xaCd9820b0A2229a82dc1A0770307ce5522FF3582',
      CSFeeOracle: '0xe7314f561B2e72f9543F1004e741bab6Fc51028B',
      CSModule: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
      CSVerifier: '0x16D0f6068D211608e3703323314aa976a6492D09',
      ExitBusOracle: '0x8664d394C2B3278F26A1B44B967aEf99707eeAB2',
      StakingRouter: '0xCc820558B39ee15C7C45B59390B503b83fb499A8',
    },
    deploymentBlockNumber: undefined,
    stakingModuleId: 4,
    withdrawalCredentials: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
    retentionPeriodMins: 80_640, // 8 weeks
    slotsPerFrame: 32 * 225 * 1, // 1 days
  },
  [CHAINS.Holesky]: {
    contracts: {
      CSAccounting: '0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1',
      CSEarlyAdoption: '0x71E92eA77C198a770d9f33A03277DbeB99989660',
      CSFeeDistributor: '0xD7ba648C8F72669C6aE649648B516ec03D07c8ED',
      CSFeeOracle: '0xaF57326C7d513085051b50912D51809ECC5d98Ee',
      CSModule: '0x4562c3e63c2e586cD1651B958C22F88135aCAd4f',
      CSVerifier: '0x6DcA479178E6Ae41CCEB72a88FfDaa3e10E83CB7',
      ExitBusOracle: '0xffDDF7025410412deaa05E3E1cE68FE53208afcb',
      StakingRouter: '0xd6EbF043D30A7fe46D1Db32BA90a0A51207FE229',
    },
    deploymentBlockNumber: '0x1b143a',
    stakingModuleId: 4,
    withdrawalCredentials: '0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9',
    retentionPeriodMins: 80_640, // 8 weeks
    slotsPerFrame: 32 * 225 * 7, // 7 days
  },
};

export const getCsmConstants = (
  chainId: ALL_CHAINS | undefined = config.defaultChain,
) => {
  const constants = CONSTANTS_BY_NETWORK[chainId as unknown as CHAINS];
  if (!constants) {
    throw new Error(`CSM constants for chain [${chainId}] are not specified`);
  }
  return constants;
};

export const getCsmContractAddress = (
  chainId: ALL_CHAINS | undefined,
  contract: CsmContract,
): Address => getCsmConstants(chainId).contracts[contract];

export const getCsmContractAddressGetter =
  (contract: CsmContract) => (chainId: ALL_CHAINS) =>
    getCsmContractAddress(chainId, contract);
