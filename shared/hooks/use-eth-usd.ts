import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { AggregatorAbi } from 'abi/aggregator-abi';
import { STRATEGY_LAZY } from 'consts';
import { useMainnetOnlyWagmi } from 'modules/web3/web3-provider/web3-provider';
import invariant from 'tiny-invariant';
import { weiToEth } from 'utils';
import { getContract } from 'viem';

export const MAINNET_AGGREGATOR_ADDRESS =
  '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

// TODO: use eth-api.lido.fi
export const useEthUsd = (amount?: bigint) => {
  const { publicClientMainnet } = useMainnetOnlyWagmi();

  const {
    data: price,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['eth-usd-price', publicClientMainnet],
    enabled: !!publicClientMainnet,
    ...STRATEGY_LAZY,
    // the async is needed here because the decimals will be requested soon
    queryFn: async () => {
      invariant(
        publicClientMainnet,
        '[useEthUsd] The "publicClientMainnet" must be define',
      );

      const contract = getContract({
        address: MAINNET_AGGREGATOR_ADDRESS,
        abi: AggregatorAbi,
        client: {
          public: publicClientMainnet,
        },
      });

      const [latestAnswer, decimals] = await Promise.all([
        contract.read.latestAnswer(),
        contract.read.decimals(),
      ]);

      return latestAnswer / 10n ** BigInt(decimals);
    },
  });

  const usdAmount = useMemo(() => {
    if (price && amount !== undefined) {
      return weiToEth(amount) * Number(price);
    }
    return undefined;
  }, [amount, price]);

  return {
    usdAmount,
    price,
    isLoading,
    error,
    isFetching,
    update: refetch,
  };
};
