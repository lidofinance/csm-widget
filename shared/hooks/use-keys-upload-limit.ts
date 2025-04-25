import { useMergeSwr, useNodeOperatorInfo } from 'shared/hooks';
import { NodeOperatorId } from 'types';

export const useNonWithdrawnKeysCount = (nodeOperatorId?: NodeOperatorId) => {
  const swrInfo = useNodeOperatorInfo(nodeOperatorId);

  return useMergeSwr(
    [swrInfo],
    (swrInfo.data?.totalAddedKeys ?? 0) -
      (swrInfo.data?.totalWithdrawnKeys ?? 0),
  );
};

export const useTotalAddedKeysCount = (nodeOperatorId?: NodeOperatorId) => {
  const swrInfo = useNodeOperatorInfo(nodeOperatorId);

  return useMergeSwr([swrInfo], swrInfo.data?.totalAddedKeys ?? 0);
};
