import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useConnection,
  useBalance,
  useReadContract,
  useWatchContractEvent,
} from 'wagmi';

import { config } from 'config';
import { useDappStatus, useSmSDK } from 'modules/web3';
import { CONTRACT_NAMES } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts/modules';
import {
  erc20Abi,
  getAbiItem,
  type Abi,
  type Address,
  type WatchContractEventOnLogsFn,
} from 'viem';
import type { GetBalanceData } from 'wagmi/query';

const selectBalance = (data: GetBalanceData) => data.value;

export const useEthereumBalance = () => {
  const { address, isAccountActive } = useDappStatus();

  return useBalance({
    address,
    query: {
      select: selectBalance,
      staleTime: config.PROVIDER_POLLING_INTERVAL,
      refetchInterval: config.PROVIDER_POLLING_INTERVAL,
      enabled: isAccountActive,
    },
  });
};

type TokenContract = { address: Address | undefined; abi: Abi };

type TokenSubscriptionState = Record<
  Address,
  {
    subscribers: number;
    queryKey: QueryKey;
  }
>;

type SubscribeArgs = {
  tokenAddress: Address;
  queryKey: QueryKey;
};

type UseBalanceProps = {
  shouldSubscribeToUpdates?: boolean;
};

export const Erc20EventsAbi = [
  getAbiItem({
    abi: erc20Abi,
    name: 'Transfer',
  }),
];

type OnLogsFn = WatchContractEventOnLogsFn<
  typeof Erc20EventsAbi,
  'Transfer',
  true
>;

const onError = (error: unknown) =>
  console.warn(
    '[useTokenTransferSubscription] error while watching events',
    error,
  );

export const useTokenTransferSubscription = () => {
  const { address } = useConnection();
  const queryClient = useQueryClient();
  const [subscriptions, setSubscriptions] = useState<TokenSubscriptionState>(
    {},
  );

  const tokens = useMemo(
    () => Object.keys(subscriptions) as Address[],
    [subscriptions],
  );

  const onLogs: OnLogsFn = useCallback(
    (logs) => {
      for (const log of logs) {
        const subscription =
          subscriptions[log.address.toLowerCase() as Address];
        if (!subscription) continue;
        // we could optimistically update balance data
        // but it's easier to refetch balance after transfer
        void queryClient.invalidateQueries(
          {
            queryKey: subscription.queryKey,
          },
          { cancelRefetch: false },
        );
      }
    },
    [queryClient, subscriptions],
  );

  const shouldWatch = !!(address && tokens.length > 0);

  useWatchContractEvent({
    abi: Erc20EventsAbi,
    eventName: 'Transfer',
    batch: true,
    poll: true,
    args: useMemo(
      () => ({
        to: address,
      }),
      [address],
    ),
    address: tokens,
    enabled: shouldWatch,
    onLogs,
    onError,
  });

  useWatchContractEvent({
    abi: Erc20EventsAbi,
    eventName: 'Transfer',
    batch: true,
    poll: true,
    args: useMemo(
      () => ({
        from: address,
      }),
      [address],
    ),
    address: tokens,
    enabled: shouldWatch,
    onLogs,
    onError,
  });

  const subscribe = useCallback(
    ({ tokenAddress: _tokenAddress, queryKey }: SubscribeArgs) => {
      const tokenAddress = _tokenAddress.toLowerCase() as Address;
      setSubscriptions((old) => {
        const existing = old[tokenAddress];
        return {
          ...old,
          [tokenAddress]: {
            queryKey,
            subscribers: existing?.subscribers ?? 0 + 1,
          },
        };
      });

      // returns unsubscribe to be used as useEffect return fn (for unmount)
      return () => {
        setSubscriptions((old) => {
          const existing = old[tokenAddress];
          if (!existing) return old;
          if (existing.subscribers > 1) {
            return {
              ...old,
              [tokenAddress]: {
                ...existing,
                subscribers: existing.subscribers - 1,
              },
            };
          } else {
            delete old[tokenAddress];
            return { ...old };
          }
        });
      };
    },
    [],
  );

  return subscribe;
};

const useTokenBalance = (contract: TokenContract, shouldSubscribe = true) => {
  const { isAccountActive, address } = useDappStatus();
  const subscribe = useTokenTransferSubscription();

  const balanceQuery = useReadContract({
    abi: erc20Abi,
    address: contract.address,
    functionName: 'balanceOf',
    args: address && [address],
    query: {
      enabled: isAccountActive && !!contract.address,
      // because we update on events we can have high staleTime
      // this prevents loader when changing pages
      // but safes us from laggy user RPCs
      staleTime: config.PROVIDER_POLLING_INTERVAL * 2,
      refetchInterval: config.PROVIDER_POLLING_INTERVAL * 2,
    },
  });

  useEffect(() => {
    if (shouldSubscribe && isAccountActive && contract.address) {
      return subscribe({
        tokenAddress: contract.address,
        queryKey: balanceQuery.queryKey,
      });
    }
    // queryKey causes rerender
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountActive, contract.address]);

  return balanceQuery;
};

// stETH/wstETH are chain-wide: any deployed module's SDK resolves the same addresses
const useTokenContract = (
  name: CONTRACT_NAMES.stETH | CONTRACT_NAMES.wstETH,
) => {
  const sdk = useSmSDK(deployedModules[0]);
  return { address: sdk?.core.getContractAddress(name), abi: erc20Abi };
};

export const useStethBalance = ({
  shouldSubscribeToUpdates = true,
}: UseBalanceProps = {}) =>
  useTokenBalance(
    useTokenContract(CONTRACT_NAMES.stETH),
    shouldSubscribeToUpdates,
  );

export const useWstethBalance = ({
  shouldSubscribeToUpdates = true,
}: UseBalanceProps = {}) =>
  useTokenBalance(
    useTokenContract(CONTRACT_NAMES.wstETH),
    shouldSubscribeToUpdates,
  );
