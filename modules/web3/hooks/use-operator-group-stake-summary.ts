import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_GROUP_SUMMARY = ['operator-group-summary'];

export const useOperatorGroupStakeSummary = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [...KEY_OPERATOR_GROUP_SUMMARY, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      invariant(nodeOperatorId !== undefined);
      return sdk.metaRegistry.getOperatorGroupStakeSummary(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });
};
