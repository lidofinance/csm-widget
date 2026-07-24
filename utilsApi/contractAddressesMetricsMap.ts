import {
  COMMON_ADDRESSES,
  CONTRACT_BASE_ABI,
  CONTRACT_NAMES,
  MODULE_CONFIG,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';
import { CHAINS, LidoLocatorAbi } from '@lidofinance/lido-ethereum-sdk';
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
import { mainnet } from 'viem/chains';

import { ENSUniversalResolverAbi } from 'abi/ens-universal-resolver-abi';
import { config } from 'config';
import { overridedAddresses } from 'modules/web3/web3-provider/devnet';
import { AggregatorAbi } from 'abi/aggregator-abi';

const AlL_CONTRACT_NAMES = {
  ...CONTRACT_NAMES,
  aggregatorStEthUsdPriceFeed: 'aggregatorStEthUsdPriceFeed',
  aggregatorEthUsdPrice: 'aggregatorEthUsdPrice',
  lidoLocator: 'lidoLocator',
  lidoUnsteth: 'lidoUnsteth',
  ensUniversalResolver: 'ensUniversalResolver',
} as const;
type AlL_CONTRACT_NAMES = keyof typeof AlL_CONTRACT_NAMES;

const supportedChainsWithMainnet: SUPPORTED_CHAINS[] = uniq([
  config.defaultChain,
  CHAINS.Mainnet,
]);

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
    [AlL_CONTRACT_NAMES.ensUniversalResolver]:
      mainnet.contracts.ensUniversalResolver.address,
  },
  [CHAINS.Hoodi]: {
    [AlL_CONTRACT_NAMES.lidoLocator]:
      '0xe2EF9536DAAAEBFf5b1c130957AB3E80056b06D8',
    [AlL_CONTRACT_NAMES.lidoUnsteth]:
      '0xfe56573178f1bcdf53F01A6E9977670dcBBD9186',
  },
};

const CONTRACT_ADDRESSES = {
  ...COMMON_ADDRESSES[config.defaultChain],
  ...MODULE_CONFIG[config.module][config.defaultChain]?.contractAddresses,
  ...overridedAddresses,
};

const getContractAddress = (
  name: AlL_CONTRACT_NAMES,
  chainId: SUPPORTED_CHAINS,
) =>
  STATIC_ADDRESSES[chainId]?.[name] ??
  CONTRACT_ADDRESSES?.[name as CONTRACT_NAMES];
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
  AlL_CONTRACT_NAMES.curatedModule,
  AlL_CONTRACT_NAMES.accounting,
  AlL_CONTRACT_NAMES.feeOracle,
  AlL_CONTRACT_NAMES.feeDistributor,
  AlL_CONTRACT_NAMES.ejector,
  AlL_CONTRACT_NAMES.validatorsExitBusOracle,
  CONTRACT_NAMES.wstETH,
  CONTRACT_NAMES.stETH,
];

export const allowedCallAddresses = mapValues(METRIC_CONTRACT_ADDRESSES, keys);

export const allowedLogsAddresses = mapValues(METRIC_CONTRACT_ADDRESSES, (o) =>
  keys(pickBy(o, (v) => CONTRACT_LIST_LOGS.includes(v))),
);

const METRIC_CONTRACT_ABIS: Record<AlL_CONTRACT_NAMES, Abi> = {
  [AlL_CONTRACT_NAMES.lidoLocator]: LidoLocatorAbi,
  [AlL_CONTRACT_NAMES.lidoRewardsVault]: [],
  [AlL_CONTRACT_NAMES.lidoUnsteth]: [],
  [AlL_CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]: AggregatorAbi,
  [AlL_CONTRACT_NAMES.aggregatorEthUsdPrice]: AggregatorAbi,
  [AlL_CONTRACT_NAMES.ensUniversalResolver]: ENSUniversalResolverAbi,
  ...CONTRACT_BASE_ABI,
};

export const getMetricContractAbi = memoize(
  (contractName: AlL_CONTRACT_NAMES) => {
    return METRIC_CONTRACT_ABIS[contractName];
  },
);
