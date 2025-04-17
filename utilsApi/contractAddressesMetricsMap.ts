import { utils } from 'ethers';
import { memoize } from 'lodash';

import {
  TOKENS,
  getAggregatorAddress,
  getTokenAddress,
  getWithdrawalQueueAddress,
} from '@lido-sdk/constants';
import {
  StethAbiFactory,
  WithdrawalQueueAbiFactory,
  WstethAbiFactory,
} from '@lido-sdk/contracts';

import { config } from 'config';
import { getCsmContractAddress } from 'consts/csm-constants';
import {
  CSAccounting__factory,
  CSEarlyAdoption__factory,
  CSFeeDistributor__factory,
  CSFeeOracle__factory,
  CSModule__factory,
  ExitBusOracle__factory,
  HashConsensus__factory,
  StakingRouter__factory,
} from 'generated';
import { HexString } from 'shared/keys';
import { CHAINS } from 'consts';

const getAddressGetter = <
  C extends CHAINS,
  N extends string,
  G extends (chainId: C, name: N) => string,
>(
  getter: G,
  name?: N,
) => {
  return (chainId: C) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const address = getter(chainId, name!);
      return address ? utils.getAddress(address) : null;
    } catch (error) {
      return null;
    }
  };
};

export const CONTRACT_NAMES = {
  stETH: 'stETH',
  wstETH: 'wstETH',
  WithdrawalQueue: 'WithdrawalQueue',
  aggregatorStEthUsdPriceFeed: 'aggregatorStEthUsdPriceFeed',
  CSModule: 'CSModule',
  CSAccounting: 'CSAccounting',
  CSFeeDistributor: 'CSFeeDistributor',
  CSFeeOracle: 'CSFeeOracle',
  HashConsensus: 'HashConsensus',
  CSEarlyAdoption: 'CSEarlyAdoption',
  ExitBusOracle: 'ExitBusOracle',
  StakingRouter: 'StakingRouter',
  Multicall3: 'Multicall3',
} as const;
export type CONTRACT_NAMES = keyof typeof CONTRACT_NAMES;

const CONTRACT_LIST_CALL: CONTRACT_NAMES[] = [
  CONTRACT_NAMES.stETH,
  CONTRACT_NAMES.wstETH,
  CONTRACT_NAMES.WithdrawalQueue,
  CONTRACT_NAMES.aggregatorStEthUsdPriceFeed,
  CONTRACT_NAMES.CSModule,
  CONTRACT_NAMES.CSAccounting,
  CONTRACT_NAMES.CSEarlyAdoption,
  CONTRACT_NAMES.CSFeeDistributor,
  CONTRACT_NAMES.CSFeeOracle,
  CONTRACT_NAMES.HashConsensus,
  CONTRACT_NAMES.ExitBusOracle,
  CONTRACT_NAMES.StakingRouter,
  CONTRACT_NAMES.Multicall3,
];

const CONTRACT_LIST_LOGS: CONTRACT_NAMES[] = [
  CONTRACT_NAMES.CSModule,
  CONTRACT_NAMES.CSFeeOracle,
  CONTRACT_NAMES.ExitBusOracle,
];

export const METRIC_CONTRACT_ABIS = {
  [CONTRACT_NAMES.stETH]: StethAbiFactory.abi,
  [CONTRACT_NAMES.wstETH]: WstethAbiFactory.abi,
  [CONTRACT_NAMES.WithdrawalQueue]: WithdrawalQueueAbiFactory.abi,
  [CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]: [{}],
  [CONTRACT_NAMES.CSModule]: CSModule__factory.abi,
  [CONTRACT_NAMES.CSAccounting]: CSAccounting__factory.abi,
  [CONTRACT_NAMES.CSFeeDistributor]: CSFeeDistributor__factory.abi,
  [CONTRACT_NAMES.CSFeeOracle]: CSFeeOracle__factory.abi,
  [CONTRACT_NAMES.HashConsensus]: HashConsensus__factory.abi,
  [CONTRACT_NAMES.CSEarlyAdoption]: CSEarlyAdoption__factory.abi,
  [CONTRACT_NAMES.ExitBusOracle]: ExitBusOracle__factory.abi,
  [CONTRACT_NAMES.StakingRouter]: StakingRouter__factory.abi,
  [CONTRACT_NAMES.Multicall3]: [],
} as const;

const METRIC_CONTRACT_ADDRESS_GETTERS = {
  [CONTRACT_NAMES.stETH]: getAddressGetter(getTokenAddress, TOKENS.STETH),
  [CONTRACT_NAMES.wstETH]: getAddressGetter(getTokenAddress, TOKENS.WSTETH),
  [CONTRACT_NAMES.WithdrawalQueue]: getAddressGetter(getWithdrawalQueueAddress),
  [CONTRACT_NAMES.aggregatorStEthUsdPriceFeed]: () =>
    getAddressGetter(getAggregatorAddress)(CHAINS.Mainnet),
  [CONTRACT_NAMES.CSModule]: getAddressGetter(
    getCsmContractAddress,
    'CSModule',
  ),
  [CONTRACT_NAMES.CSAccounting]: getAddressGetter(
    getCsmContractAddress,
    'CSAccounting',
  ),
  [CONTRACT_NAMES.CSFeeDistributor]: getAddressGetter(
    getCsmContractAddress,
    'CSFeeDistributor',
  ),
  [CONTRACT_NAMES.CSFeeOracle]: getAddressGetter(
    getCsmContractAddress,
    'CSFeeOracle',
  ),
  [CONTRACT_NAMES.HashConsensus]: getAddressGetter(
    getCsmContractAddress,
    'HashConsensus',
  ),
  [CONTRACT_NAMES.CSEarlyAdoption]: getAddressGetter(
    getCsmContractAddress,
    'CSEarlyAdoption',
  ),
  [CONTRACT_NAMES.ExitBusOracle]: getAddressGetter(
    getCsmContractAddress,
    'ExitBusOracle',
  ),
  [CONTRACT_NAMES.StakingRouter]: getAddressGetter(
    getCsmContractAddress,
    'StakingRouter',
  ),
  [CONTRACT_NAMES.Multicall3]: () =>
    '0xcA11bde05977b3631167028862bE2a173976CA11',
};

const aggregatorMainnetAddress = METRIC_CONTRACT_ADDRESS_GETTERS[
  CONTRACT_NAMES.aggregatorStEthUsdPriceFeed
]() as HexString;

const prefilledAddresses =
  config.defaultChain !== CHAINS.Mainnet
    ? ({
        [CHAINS.Mainnet]: [aggregatorMainnetAddress],
      } as Record<CHAINS, HexString[]>)
    : ({} as Record<CHAINS, HexString[]>);

const prefilledMetricAddresses: Partial<
  Record<CHAINS, Record<HexString, CONTRACT_NAMES>>
> =
  config.defaultChain !== CHAINS.Mainnet
    ? {
        [CHAINS.Mainnet]: {
          [aggregatorMainnetAddress]:
            CONTRACT_NAMES.aggregatorStEthUsdPriceFeed,
        },
      }
    : {};

export const getMetricContractInterface = memoize(
  (contractName: CONTRACT_NAMES) =>
    new utils.Interface(METRIC_CONTRACT_ABIS[contractName]),
);

export const METRIC_CONTRACT_ADDRESSES = (
  config.supportedChains as CHAINS[]
).reduce((mapped, chainId) => {
  const map = Object.fromEntries(
    Object.entries(METRIC_CONTRACT_ADDRESS_GETTERS)
      .map(([name, getter]) => [getter(chainId), name])
      .filter(([, address]) => address !== null),
  );
  return {
    ...mapped,
    [chainId]: map,
  };
}, prefilledMetricAddresses);

export const CONTRACT_LOGS_ADDRESSES = (
  config.supportedChains as CHAINS[]
).reduce((mapped, chainId) => {
  const list = CONTRACT_LIST_LOGS.map((name) =>
    METRIC_CONTRACT_ADDRESS_GETTERS[name](chainId),
  ).filter((address) => !!address);
  return {
    ...mapped,
    [chainId]: list,
  };
}, prefilledAddresses);

export const CONTRACT_CALL_ADDRESSES = (
  config.supportedChains as CHAINS[]
).reduce((mapped, chainId) => {
  const list = CONTRACT_LIST_CALL.map((name) =>
    METRIC_CONTRACT_ADDRESS_GETTERS[name](chainId),
  ).filter((address) => !!address);
  return {
    ...mapped,
    [chainId]: list,
  };
}, prefilledAddresses);
