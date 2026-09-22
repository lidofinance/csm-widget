import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { SmSDK, useTargetSmSDK } from '../web3-provider';

export type OperatorQueryArgs = {
  sdk: SmSDK | undefined;
  nodeOperatorId: NodeOperatorId | undefined;
};

export type OperatorHookArgs<T, TData = T> = {
  nodeOperatorId: NodeOperatorId | undefined;
  module?: MODULE_NAME;
  select?: (data: T) => TData;
};

export const useOperatorQuery = <
  T,
  TData = T,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: (args: OperatorQueryArgs) => UseQueryOptions<T, Error, T, TQueryKey>,
  { nodeOperatorId, module, select }: OperatorHookArgs<T, TData>,
) => {
  const { sdk } = useTargetSmSDK(module);
  return useQuery({ ...options({ sdk, nodeOperatorId }), select });
};
