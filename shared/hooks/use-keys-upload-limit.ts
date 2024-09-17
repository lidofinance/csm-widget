import { getCsmConstants } from 'consts/csm-constants';
import { MAX_KEYS_TO_UPLOAD } from 'consts/treshhold';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import {
  useAccount,
  useCsmStatus,
  useMergeSwr,
  useNodeOperatorInfo,
} from 'shared/hooks';

/**
 * 0 = no limits
 */
export const useKeysLimit = () => {
  const swrStatus = useCsmStatus();
  const { chainId } = useAccount();

  return useMergeSwr(
    [swrStatus],
    swrStatus.data?.isEarlyAdoption
      ? getCsmConstants(chainId).earlyAdoptionMaxKeys
      : 0,
  );
};

export const useKeysUploaded = () => {
  const nodeOperatorId = useNodeOperatorId();
  const swrInfo = useNodeOperatorInfo(nodeOperatorId);

  return useMergeSwr([swrInfo], swrInfo.data?.totalAddedKeys ?? 0);
};

export const useKeysUploadLimit = () => {
  const swrUploaded = useKeysUploaded();
  const swrLimit = useKeysLimit();

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
