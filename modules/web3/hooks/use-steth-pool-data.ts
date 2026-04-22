import { StethPoolData } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from 'modules/web3';

export const KEY_STETH_POOL_DATA = ['steth-pool-data'];

export const useStethPoolData = <TData = StethPoolData>(
  select?: (data: StethPoolData) => TData,
) => {
  const { accounting } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_STETH_POOL_DATA],
    ...STRATEGY_CONSTANT,
    queryFn: () => accounting.getStethPoolData(),
    select,
  });
};
