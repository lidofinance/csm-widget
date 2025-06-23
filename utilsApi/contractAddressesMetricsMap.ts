import {
  CSM_CONTRACT_ADDRESSES,
  CSM_CONTRACT_NAMES,
  CSM_SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';
import {
  CHAINS,
  LidoLocatorAbi,
  StethAbi,
  WstethABI,
} from '@lidofinance/lido-ethereum-sdk';
import {
  fromPairs,
  invert,
  isUndefined,
  keys,
  mapValues,
  memoize,
  omitBy,
  pickBy,
  uniq,
} from 'lodash';
import { Abi, Address } from 'viem';

import { config } from 'config';
import {
  CSAccountingAbi,
  CSEjectorAbi,
  CSFeeDistributorAbi,
  CSFeeOracleAbi,
  CSModuleAbi,
  CSParametersRegistryAbi,
  CSStrikesAbi,
  HashConsensusAbi,
  PermissionlessGateAbi,
  StakingRouterAbi,
  ValidatorsExitBusOracleAbi,
  VettedGateAbi,
} from '@lidofinance/lido-csm-sdk/abi';
import { overridedAddresses } from 'modules/web3/web3-provider/devnet';

const CONTRACT_NAMES = {
  ...CSM_CONTRACT_NAMES,
  aggregatorStEthUsdPriceFeed: 'aggregatorStEthUsdPriceFeed',
  aggregatorEthUsdPrice: 'aggregatorEthUsdPrice',
  lidoLocator: 'lidoLocator',

  ens1: 'ens1',
  ens2: 'ens2',
  ens3: 'ens3',
  ens4: 'ens4',
  ens5: 'ens5',
  ens6: 'ens6',

  // TODO: remove this
  CSAccounting_v1: 'CSAccounting_v1',
  CSFeeDistributor_v1: 'CSFeeDistributor_v1',
  CSFeeOracle_v1: 'CSFeeOracle_v1',
  CSModule_v1: 'CSModule_v1',
  HashConsensus_v1: 'HashConsensus_v1',
} as const;
type CONTRACT_NAMES = keyof typeof CONTRACT_NAMES;

const supportedChainsWithMainnet: CSM_SUPPORTED_CHAINS[] = uniq([
  ...config.supportedChains,
  CHAINS.Mainnet,
]);

const STATIC_ADDRESSES: {
  [key in CSM_SUPPORTED_CHAINS]?: { [key in CONTRACT_NAMES]?: Address };
} = {
  [CHAINS.Mainnet]: {
    [CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]:
      '0xcfe54b5cd566ab89272946f602d76ea879cab4a8',
    [CONTRACT_NAMES.aggregatorEthUsdPrice]:
      '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    [CONTRACT_NAMES.ens1]: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    [CONTRACT_NAMES.ens2]: '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63',
    [CONTRACT_NAMES.ens3]: '0x64969fb44091A7E5fA1213D30D7A7e8488edf693',
    [CONTRACT_NAMES.ens4]: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
    [CONTRACT_NAMES.ens5]: '0xa2c122be93b0074270ebee7f6b7292c7deb45047',
    [CONTRACT_NAMES.ens6]: '0x1da022710df5002339274aadee8d58218e9d6ab5',

    [CONTRACT_NAMES.CSAccounting_v1]:
      '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
    [CONTRACT_NAMES.CSFeeDistributor_v1]:
      '0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0',
    [CONTRACT_NAMES.CSFeeOracle_v1]:
      '0x4D4074628678Bd302921c20573EEa1ed38DdF7FB',
    [CONTRACT_NAMES.CSModule_v1]: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
    [CONTRACT_NAMES.HashConsensus_v1]:
      '0x71093efF8D8599b5fA340D665Ad60fA7C80688e4',
  },
  [CHAINS.Hoodi]: {
    [CONTRACT_NAMES.lidoLocator]: '0xe2EF9536DAAAEBFf5b1c130957AB3E80056b06D8',
    [CONTRACT_NAMES.CSAccounting_v1]:
      '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
    [CONTRACT_NAMES.CSFeeDistributor_v1]:
      '0xaCd9820b0A2229a82dc1A0770307ce5522FF3582',
    [CONTRACT_NAMES.CSFeeOracle_v1]:
      '0xe7314f561B2e72f9543F1004e741bab6Fc51028B',
    [CONTRACT_NAMES.CSModule_v1]: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
    [CONTRACT_NAMES.HashConsensus_v1]:
      '0x54f74a10e4397dDeF85C4854d9dfcA129D72C637',

    ...overridedAddresses,
  },
};

const getContractAddress = (
  name: CONTRACT_NAMES,
  chainId: CSM_SUPPORTED_CHAINS,
) =>
  STATIC_ADDRESSES[chainId]?.[name] ??
  CSM_CONTRACT_ADDRESSES[chainId]?.[name as CSM_CONTRACT_NAMES];
export const METRIC_CONTRACT_ADDRESSES = fromPairs(
  supportedChainsWithMainnet.map((chainId) => [
    chainId,
    invert(
      omitBy(
        mapValues(CONTRACT_NAMES, (name) => getContractAddress(name, chainId)),
        isUndefined,
      ),
    ),
  ]),
) as Record<CSM_SUPPORTED_CHAINS, Record<Address, CONTRACT_NAMES>>;

const CONTRACT_LIST_LOGS: CONTRACT_NAMES[] = [
  CONTRACT_NAMES.csModule,
  CONTRACT_NAMES.csFeeOracle,
  CONTRACT_NAMES.validatorsExitBusOracle,

  CONTRACT_NAMES.CSModule_v1,
  CONTRACT_NAMES.CSFeeOracle_v1,
];

export const allowedCallAddresses = mapValues(METRIC_CONTRACT_ADDRESSES, keys);

export const allowedLogsAddresses = mapValues(METRIC_CONTRACT_ADDRESSES, (o) =>
  keys(pickBy(o, (v) => CONTRACT_LIST_LOGS.includes(v))),
);

const METRIC_CONTRACT_ABIS: Record<CONTRACT_NAMES, Abi> = {
  [CONTRACT_NAMES.stETH]: StethAbi,
  [CONTRACT_NAMES.wstETH]: WstethABI,
  [CONTRACT_NAMES.withdrawalVault]: [],
  [CONTRACT_NAMES.lidoRewardsVault]: [],
  [CONTRACT_NAMES.lidoLocator]: LidoLocatorAbi,
  [CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]: [],
  [CONTRACT_NAMES.aggregatorEthUsdPrice]: [],
  [CONTRACT_NAMES.ens1]: [],
  [CONTRACT_NAMES.ens2]: [],
  [CONTRACT_NAMES.ens3]: [],
  [CONTRACT_NAMES.ens4]: [],
  [CONTRACT_NAMES.ens5]: [],
  [CONTRACT_NAMES.ens6]: [],
  [CONTRACT_NAMES.validatorsExitBusOracle]: ValidatorsExitBusOracleAbi,
  [CONTRACT_NAMES.stakingRouter]: StakingRouterAbi,
  [CONTRACT_NAMES.csModule]: CSModuleAbi,
  [CONTRACT_NAMES.csAccounting]: CSAccountingAbi,
  [CONTRACT_NAMES.csFeeDistributor]: CSFeeDistributorAbi,
  [CONTRACT_NAMES.csFeeOracle]: CSFeeOracleAbi,
  [CONTRACT_NAMES.hashConsensus]: HashConsensusAbi,
  [CONTRACT_NAMES.csEjector]: CSEjectorAbi,
  [CONTRACT_NAMES.csParametersRegistry]: CSParametersRegistryAbi,
  [CONTRACT_NAMES.csStrikes]: CSStrikesAbi,
  [CONTRACT_NAMES.permissionlessGate]: PermissionlessGateAbi,
  [CONTRACT_NAMES.vettedGate]: VettedGateAbi,
  [CONTRACT_NAMES.csExitPenalties]: [],

  [CONTRACT_NAMES.CSAccounting_v1]: [],
  [CONTRACT_NAMES.CSFeeDistributor_v1]: [],
  [CONTRACT_NAMES.CSFeeOracle_v1]: [],
  [CONTRACT_NAMES.CSModule_v1]: [],
  [CONTRACT_NAMES.HashConsensus_v1]: [],
};

export const getMetricContractAbi = memoize((contractName: CONTRACT_NAMES) => {
  return METRIC_CONTRACT_ABIS[contractName];
});
