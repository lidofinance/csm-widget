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
  CSExitPenaltiesAbi,
  CSFeeDistributorAbi,
  CSFeeOracleAbi,
  CSModuleAbi,
  CSMSatelliteAbi,
  CSParametersRegistryAbi,
  CSStrikesAbi,
  HashConsensusAbi,
  PermissionlessGateAbi,
  StakingRouterAbi,
  ValidatorsExitBusOracleAbi,
  VettedGateAbi,
} from '@lidofinance/lido-csm-sdk/abi';
// import { overridedAddresses } from 'modules/web3/web3-provider/devnet';

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
} as const;
type CONTRACT_NAMES = keyof typeof CONTRACT_NAMES;

const supportedChainsWithMainnet: CSM_SUPPORTED_CHAINS[] = uniq([
  ...config.supportedChains,
  CHAINS.Mainnet,
]);

// FIXME: addresses
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
  },
  [CHAINS.Hoodi]: {
    [CONTRACT_NAMES.lidoLocator]: '0xe2EF9536DAAAEBFf5b1c130957AB3E80056b06D8',
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
  [CONTRACT_NAMES.csExitPenalties]: CSExitPenaltiesAbi,
  [CONTRACT_NAMES.CSMSatellite]: CSMSatelliteAbi,
};

export const getMetricContractAbi = memoize((contractName: CONTRACT_NAMES) => {
  return METRIC_CONTRACT_ABIS[contractName];
});
