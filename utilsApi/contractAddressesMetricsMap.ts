import {
  CSM_CONTRACT_ADDRESSES,
  CONTRACT_NAMES,
  SUPPORTED_CHAINS,
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
  AccountingAbi,
  EjectorAbi,
  ExitPenaltiesAbi,
  FeeDistributorAbi,
  FeeOracleAbi,
  CSModuleAbi,
  CSMSatelliteAbi,
  ParametersRegistryAbi,
  ValidatorStrikesAbi,
  HashConsensusAbi,
  PermissionlessGateAbi,
  StakingRouterAbi,
  ValidatorsExitBusOracleAbi,
  VettedGateAbi,
  CuratedGateAbi,
  CuratedModuleAbi,
  OperatorsDataAbi,
  VerifierAbi,
} from '@lidofinance/lido-csm-sdk/abi';
// import { overridedAddresses } from 'modules/web3/web3-provider/devnet';

const AlL_CONTRACT_NAMES = {
  ...CONTRACT_NAMES,
  aggregatorStEthUsdPriceFeed: 'aggregatorStEthUsdPriceFeed',
  aggregatorEthUsdPrice: 'aggregatorEthUsdPrice',
  lidoLocator: 'lidoLocator',
  lidoUnsteth: 'lidoUnsteth',

  ens1: 'ens1',
  ens2: 'ens2',
  ens3: 'ens3',
  ens4: 'ens4',
  ens5: 'ens5',
  ens6: 'ens6',
  ens7: 'ens7',
} as const;
type AlL_CONTRACT_NAMES = keyof typeof AlL_CONTRACT_NAMES;

const supportedChainsWithMainnet: SUPPORTED_CHAINS[] = uniq([
  ...config.supportedChains,
  CHAINS.Mainnet,
]);

// FIXME: addresses
const STATIC_ADDRESSES: {
  [key in SUPPORTED_CHAINS]?: { [key in AlL_CONTRACT_NAMES]?: Address };
} = {
  [CHAINS.Mainnet]: {
    [AlL_CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]:
      '0xcfe54b5cd566ab89272946f602d76ea879cab4a8',
    [AlL_CONTRACT_NAMES.aggregatorEthUsdPrice]:
      '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    [AlL_CONTRACT_NAMES.lidoLocator]:
      '0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb',
    [AlL_CONTRACT_NAMES.lidoUnsteth]:
      '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
    [AlL_CONTRACT_NAMES.ens1]: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
    [AlL_CONTRACT_NAMES.ens2]: '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63',
    [AlL_CONTRACT_NAMES.ens3]: '0x64969fb44091A7E5fA1213D30D7A7e8488edf693',
    [AlL_CONTRACT_NAMES.ens4]: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
    [AlL_CONTRACT_NAMES.ens5]: '0xa2c122be93b0074270ebee7f6b7292c7deb45047',
    [AlL_CONTRACT_NAMES.ens6]: '0x1da022710df5002339274aadee8d58218e9d6ab5',
    [AlL_CONTRACT_NAMES.ens7]: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
  },
  [CHAINS.Hoodi]: {
    [AlL_CONTRACT_NAMES.lidoLocator]:
      '0xe2EF9536DAAAEBFf5b1c130957AB3E80056b06D8',
    [AlL_CONTRACT_NAMES.lidoUnsteth]:
      '0xfe56573178f1bcdf53F01A6E9977670dcBBD9186',
  },
};

const getContractAddress = (
  name: AlL_CONTRACT_NAMES,
  chainId: SUPPORTED_CHAINS,
) =>
  STATIC_ADDRESSES[chainId]?.[name] ??
  CSM_CONTRACT_ADDRESSES[chainId]?.[name as CONTRACT_NAMES];
export const METRIC_CONTRACT_ADDRESSES = fromPairs(
  supportedChainsWithMainnet.map((chainId) => [
    chainId,
    invert(
      omitBy(
        mapValues(AlL_CONTRACT_NAMES, (name) =>
          getContractAddress(name, chainId),
        ),
        isUndefined,
      ),
    ),
  ]),
) as Record<SUPPORTED_CHAINS, Record<Address, AlL_CONTRACT_NAMES>>;

const CONTRACT_LIST_LOGS: AlL_CONTRACT_NAMES[] = [
  AlL_CONTRACT_NAMES.csModule,
  AlL_CONTRACT_NAMES.accounting,
  AlL_CONTRACT_NAMES.feeOracle,
  AlL_CONTRACT_NAMES.feeDistributor,
  AlL_CONTRACT_NAMES.validatorsExitBusOracle,
  CONTRACT_NAMES.wstETH,
  CONTRACT_NAMES.stETH,
];

export const allowedCallAddresses = mapValues(METRIC_CONTRACT_ADDRESSES, keys);

export const allowedLogsAddresses = mapValues(METRIC_CONTRACT_ADDRESSES, (o) =>
  keys(pickBy(o, (v) => CONTRACT_LIST_LOGS.includes(v))),
);

const METRIC_CONTRACT_ABIS: Record<AlL_CONTRACT_NAMES, Abi> = {
  [AlL_CONTRACT_NAMES.stETH]: StethAbi,
  [AlL_CONTRACT_NAMES.wstETH]: WstethABI,
  [AlL_CONTRACT_NAMES.withdrawalVault]: [],
  [AlL_CONTRACT_NAMES.lidoRewardsVault]: [],
  [AlL_CONTRACT_NAMES.lidoLocator]: LidoLocatorAbi,
  [AlL_CONTRACT_NAMES.lidoUnsteth]: [],
  [AlL_CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]: [],
  [AlL_CONTRACT_NAMES.aggregatorEthUsdPrice]: [],
  [AlL_CONTRACT_NAMES.ens1]: [],
  [AlL_CONTRACT_NAMES.ens2]: [],
  [AlL_CONTRACT_NAMES.ens3]: [],
  [AlL_CONTRACT_NAMES.ens4]: [],
  [AlL_CONTRACT_NAMES.ens5]: [],
  [AlL_CONTRACT_NAMES.ens6]: [],
  [AlL_CONTRACT_NAMES.ens7]: [],
  [AlL_CONTRACT_NAMES.validatorsExitBusOracle]: ValidatorsExitBusOracleAbi,
  [AlL_CONTRACT_NAMES.stakingRouter]: StakingRouterAbi,
  [AlL_CONTRACT_NAMES.csModule]: CSModuleAbi,
  [AlL_CONTRACT_NAMES.accounting]: AccountingAbi,
  [AlL_CONTRACT_NAMES.feeDistributor]: FeeDistributorAbi,
  [AlL_CONTRACT_NAMES.feeOracle]: FeeOracleAbi,
  [AlL_CONTRACT_NAMES.hashConsensus]: HashConsensusAbi,
  [AlL_CONTRACT_NAMES.ejector]: EjectorAbi,
  [AlL_CONTRACT_NAMES.parametersRegistry]: ParametersRegistryAbi,
  [AlL_CONTRACT_NAMES.validatorStrikes]: ValidatorStrikesAbi,
  [AlL_CONTRACT_NAMES.permissionlessGate]: PermissionlessGateAbi,
  [AlL_CONTRACT_NAMES.vettedGate]: VettedGateAbi,
  [AlL_CONTRACT_NAMES.exitPenalties]: ExitPenaltiesAbi,
  [AlL_CONTRACT_NAMES.CSMSatellite]: CSMSatelliteAbi,
  [AlL_CONTRACT_NAMES.curatedGate]: CuratedGateAbi,
  [AlL_CONTRACT_NAMES.curatedModule]: CuratedModuleAbi,
  [AlL_CONTRACT_NAMES.operatorsData]: OperatorsDataAbi,
  [AlL_CONTRACT_NAMES.verifier]: VerifierAbi,
};

export const getMetricContractAbi = memoize(
  (contractName: AlL_CONTRACT_NAMES) => {
    return METRIC_CONTRACT_ABIS[contractName];
  },
);
