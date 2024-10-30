import { getCsmConstants } from 'consts/csm-constants';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import {
  useCsmEarlyAdoptionKeysLimit,
  useCsmPublicRelease,
  useMergeSwr,
  useNodeOperatorInfo,
} from 'shared/hooks';
import { NodeOperatorId } from 'types';

/**
 * @note 0 = no limits
 */
export const useKeysLimit = () => {
  const swrPublicRelease = useCsmPublicRelease();
  const swrEAKeysLimit = useCsmEarlyAdoptionKeysLimit();

  return useMergeSwr(
    [swrPublicRelease, swrEAKeysLimit],
    swrPublicRelease.data ? 0 : swrEAKeysLimit.data?.toNumber(),
    { immutable: true },
  );
};

export const useNonWithdrawnKeysCount = (nodeOperatorId?: NodeOperatorId) => {
  const swrInfo = useNodeOperatorInfo(nodeOperatorId);

  return useMergeSwr(
    [swrInfo],
    (swrInfo.data?.totalAddedKeys ?? 0) -
      (swrInfo.data?.totalWithdrawnKeys ?? 0),
  );
};

export const useKeysUploadLimit = () => {
  const nodeOperatorId = useNodeOperatorId();
  const swrUploaded = useNonWithdrawnKeysCount(nodeOperatorId);
  const swrLimit = useKeysLimit();

  const MAX_KEYS_TO_UPLOAD = getCsmConstants().earlyAdoptionMaxKeys;

  return useMergeSwr(
    [swrUploaded, swrLimit],
    swrLimit.data
      ? Math.min(
          Math.max(swrLimit.data - (swrUploaded.data ?? 0), 0),
          MAX_KEYS_TO_UPLOAD,
        )
      : MAX_KEYS_TO_UPLOAD,
  );
};
