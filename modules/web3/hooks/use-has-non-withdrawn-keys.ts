import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useOperatorInfo } from './use-operator-info';

export const useHasNonWithdrawnKeys = (
  nodeOperatorId: NodeOperatorId | undefined,
) =>
  useOperatorInfo({
    nodeOperatorId,
    select: (info) => info.totalAddedKeys - info.totalWithdrawnKeys > 0,
  });
