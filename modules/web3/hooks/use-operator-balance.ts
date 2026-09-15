import {
  BondBalance,
  MODULE_NAME,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { SmSDK, useTargetSmSDK } from '../web3-provider';

export const KEY_OPERATOR_BALANCE = ['operator-balance'];

export const operatorBalanceQueryOptions = (
  sdk: SmSDK | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_BALANCE,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return sdk.operator.getBondBalance(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useOperatorBalance = <TData = BondBalance>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: BondBalance) => TData,
  module?: MODULE_NAME,
) => {
  const { sdk } = useTargetSmSDK(module);
  return useQuery({
    ...operatorBalanceQueryOptions(sdk, nodeOperatorId),
    select,
  });
};
