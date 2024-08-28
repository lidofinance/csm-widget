import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { useNodeOperatorInfo, useCsmStatus, useMergeSwr } from 'shared/hooks';

const MAX_KEYS_TO_UPLOAD = 10;

export const useKeysUploadLimit = () => {
  const nodeOperatorId = useNodeOperatorId();
  const swrInfo = useNodeOperatorInfo(nodeOperatorId);
  const swrStatus = useCsmStatus();

  return useMergeSwr(
    [swrInfo, swrStatus],
    useMemo(
      () =>
        MAX_KEYS_TO_UPLOAD -
        ((swrStatus.data?.isEarlyAdoption && swrInfo.data?.totalAddedKeys) ||
          0),
      [swrInfo.data?.totalAddedKeys, swrStatus.data?.isEarlyAdoption],
    ),
  );
};
