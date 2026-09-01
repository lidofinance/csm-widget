import {
  NodeOperatorId,
  OperatorTopUpQueue,
  TOPUP_QUEUE_MODULES,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_TOP_UP_QUEUE = ['operator-top-up-queue'];

export const useOperatorTopUpQueue = <TData = OperatorTopUpQueue>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorTopUpQueue) => TData,
) => {
  const sdk = useSmSDK() as CsmFamilySDK;
  const enabled =
    TOPUP_QUEUE_MODULES.has(sdk.core.moduleName) &&
    nodeOperatorId !== undefined;

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_TOP_UP_QUEUE,
      { nodeOperatorId, module: sdk.core.moduleName },
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
