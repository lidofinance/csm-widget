import {
  MODULE_NAME,
  NodeOperatorId,
  OperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useActiveSmSDK } from '../web3-provider';

export const KEY_OPERATOR_STAKE_INFO = ['operator-stake-info'];

export const useOperatorStakeSummary = <TData = OperatorStakeSummary>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorStakeSummary) => TData,
) => {
  const sdk = useActiveSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_STAKE_INFO,
      { nodeOperatorId, module: MODULE_NAME.CM },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      invariant(nodeOperatorId !== undefined);

      return sdk.metaRegistry.getOperatorStakeSummary(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
    select,
  });
};
