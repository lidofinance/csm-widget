import { MODULE_NAME, StethPoolData } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useTargetSmSDK } from 'modules/web3';
import invariant from 'tiny-invariant';

export const KEY_STETH_POOL_DATA = ['steth-pool-data'];

export const useStethPoolData = <TData = StethPoolData>(
  select?: (data: StethPoolData) => TData,
  module?: MODULE_NAME,
) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: [...KEY_STETH_POOL_DATA, { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.accounting.getStethPoolData();
    },
    enabled: !!sdk,
    select,
  });
};
