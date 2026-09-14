import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useActiveSmSDK } from '../web3-provider';

export const KEY_OPERATOR_WEIGHT = ['operator-weight'];

export const useOperatorWeight = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const sdk = useActiveSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_WEIGHT,
      { nodeOperatorId, module: MODULE_NAME.CM },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      invariant(nodeOperatorId !== undefined);
      return sdk.metaRegistry.getOperatorWeight(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });
};
