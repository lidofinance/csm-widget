import {
  NodeOperatorId,
  OperatorTopUpQueue,
  MODULE_PROFILE,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_TOP_UP_QUEUE = ['operator-top-up-queue'];

export const useOperatorTopUpQueue = <TData = OperatorTopUpQueue>({
  nodeOperatorId,
  select,
}: {
  nodeOperatorId: NodeOperatorId | undefined;
  select?: (data: OperatorTopUpQueue) => TData;
}) => {
  const sdk = useSmSDK() as CsmFamilySDK | undefined;
  const enabled =
    !!sdk &&
    MODULE_PROFILE[sdk.core.moduleName].topUpQueue &&
    nodeOperatorId !== undefined;

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_TOP_UP_QUEUE,
      { nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk && nodeOperatorId !== undefined);
      return sdk.depositQueue.getOperatorTopUpQueue(nodeOperatorId);
    },
    select,
    enabled,
  });
};
