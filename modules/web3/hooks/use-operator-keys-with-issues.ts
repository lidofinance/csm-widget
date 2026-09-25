import { ValidatorInfoIssues } from '@lidofinance/lido-csm-sdk';
import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';

export const KEY_FEE_RECIPIENT_ISSUES = ['fee-recipient-issues'];

export const useOperatorKeysWithIssues = <TData = ValidatorInfoIssues[]>(
  args: OperatorHookArgs<ValidatorInfoIssues[], TData>,
) =>
  useOperatorQuery(
    ({ sdk, nodeOperatorId }: OperatorQueryArgs) =>
      queryOptions({
        queryKey: [
          ...KEY_FEE_RECIPIENT_ISSUES,
          { nodeOperatorId, module: sdk?.core.moduleName },
        ],
        ...STRATEGY_CONSTANT,
        queryFn: async () => {
          invariant(sdk && nodeOperatorId !== undefined);
          return sdk.feesMonitoring.getKeysWithIssues(nodeOperatorId);
        },
        enabled: !!sdk && nodeOperatorId !== undefined,
      }),
    args,
  );
