import { CHAINS } from './chains';
import { Address, Hex } from 'viem';

export type CsmContract =
  | 'CSAccounting'
  | 'CSFeeDistributor'
  | 'CSFeeOracle'
  | 'CSModule'
  | 'CSVerifier'
  | 'HashConsensus'
  | 'ExitBusOracle'
  | 'StakingRouter';

type CsmConstants = {
  contracts: Record<CsmContract, Address>;
  deploymentBlockNumber?: Hex;
  stakingModuleId: number;
  withdrawalCredentials: Address;
  retentionPeriodMins: number; // TODO: remove
};

export const CONSTANTS_BY_NETWORK: Record<CHAINS, CsmConstants> = {
  [CHAINS.Mainnet]: {
    contracts: {
      CSAccounting: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
      CSFeeDistributor: '0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0',
      CSFeeOracle: '0x4D4074628678Bd302921c20573EEa1ed38DdF7FB',
      CSModule: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
      CSVerifier: '0x3Dfc50f22aCA652a0a6F28a0F892ab62074b5583',
      HashConsensus: '0x71093efF8D8599b5fA340D665Ad60fA7C80688e4',
      ExitBusOracle: '0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e',
      StakingRouter: '0xFdDf38947aFB03C621C71b06C9C70bce73f12999',
    },
    deploymentBlockNumber: '0x13f7326',
    stakingModuleId: 3,
    withdrawalCredentials: '0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f',
    retentionPeriodMins: 80_640, // 8 weeks
  },
  [CHAINS.Hoodi]: {
    contracts: {
      CSAccounting: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
      CSFeeDistributor: '0xaCd9820b0A2229a82dc1A0770307ce5522FF3582',
      CSFeeOracle: '0xe7314f561B2e72f9543F1004e741bab6Fc51028B',
      CSModule: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
      CSVerifier: '0x16D0f6068D211608e3703323314aa976a6492D09',
      HashConsensus: '0x54f74a10e4397dDeF85C4854d9dfcA129D72C637',
      ExitBusOracle: '0x8664d394C2B3278F26A1B44B967aEf99707eeAB2',
      StakingRouter: '0xCc820558B39ee15C7C45B59390B503b83fb499A8',
    },
    deploymentBlockNumber: '0x1374',
    stakingModuleId: 4,
    withdrawalCredentials: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
    retentionPeriodMins: 80_640, // 8 weeks
  },
  [CHAINS.Holesky]: {
    contracts: {
      CSAccounting: '0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1',
      CSFeeDistributor: '0xD7ba648C8F72669C6aE649648B516ec03D07c8ED',
      CSFeeOracle: '0xaF57326C7d513085051b50912D51809ECC5d98Ee',
      CSModule: '0x4562c3e63c2e586cD1651B958C22F88135aCAd4f',
      CSVerifier: '0x6DcA479178E6Ae41CCEB72a88FfDaa3e10E83CB7',
      HashConsensus: '0xbF38618Ea09B503c1dED867156A0ea276Ca1AE37',
      ExitBusOracle: '0xffDDF7025410412deaa05E3E1cE68FE53208afcb',
      StakingRouter: '0xd6EbF043D30A7fe46D1Db32BA90a0A51207FE229',
    },
    deploymentBlockNumber: '0x1b143a',
    stakingModuleId: 4,
    withdrawalCredentials: '0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9',
    retentionPeriodMins: 80_640, // 8 weeks
  },
};

export const getCsmConstants = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    throw new Error('chainId is not specified');
  }
  const constants = CONSTANTS_BY_NETWORK[chainId];
  if (!constants) {
    throw new Error(`CSM constants for chain [${chainId}] are not specified`);
  }
  return constants;
};

export const getCsmContractAddress = (
  chainId: CHAINS,
  contract: CsmContract,
): Address => getCsmConstants(chainId).contracts[contract];
