import { BondBalance } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_OPERATOR_BALANCE = ['operator-balance'];

export const operatorBalanceQueryOptions = ({
  sdk,
  nodeOperatorId,
}: OperatorQueryArgs) =>
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
  args: OperatorHookArgs<BondBalance, TData>,
) => useOperatorQuery(operatorBalanceQueryOptions, args);
