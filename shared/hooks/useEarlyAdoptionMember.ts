import { useNodeOperatorId } from 'providers/node-operator-provider';
import {
  useCsmCurveIdEarlyAdoption,
  useCsmEarlyAdoption,
  useMergeSwr,
  useNodeOperatorCurveId,
} from 'shared/hooks';

export const useEarlyAdoptionMember = () => {
  const nodeOperatorId = useNodeOperatorId();

  const swrEaCurveId = useCsmCurveIdEarlyAdoption();
  const swrCurveId = useNodeOperatorCurveId(nodeOperatorId);

  const swrEa = useCsmEarlyAdoption();

  return useMergeSwr(
    [swrEaCurveId, swrCurveId, swrEa],
    nodeOperatorId
      ? swrCurveId.data?.eq(swrEaCurveId.data ?? 0)
      : swrEa.data?.proof && !swrEa.data.consumed,
  );
};
