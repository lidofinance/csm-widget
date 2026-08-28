import {
  NodeOperatorId,
  OperatorTopUpQueue,
  TOPUP_QUEUE_MODULES,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useSmSDK, useSmSDKByModule } from '../web3-provider';

export const KEY_OPERATOR_TOP_UP_QUEUE = ['operator-top-up-queue'];

export const useOperatorTopUpQueue = <TData = OperatorTopUpQueue>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorTopUpQueue) => TData,
) => {
  const { core } = useSmSDK();
  const sdk = useSmSDKByModule(core.moduleName) as CsmFamilySDK | undefined;
  const enabled =
    TOPUP_QUEUE_MODULES.has(core.moduleName) && nodeOperatorId !== undefined;

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_TOP_UP_QUEUE,
      { nodeOperatorId, module: core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      invariant(nodeOperatorId !== undefined);
      return sdk.depositQueue.getOperatorTopUpQueue(nodeOperatorId);
    },
    select,
    enabled,
  });
};
