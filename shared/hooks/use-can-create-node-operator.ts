import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCsmEarlyAdoption } from './useCsmEarlyAdoption';
import { useCsmPaused, useCsmPublicRelease } from './useCsmStatus';
import { useAccount } from './use-account';

export const useCanCreateNodeOperator = () => {
  const { address } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  const { data: paused } = useCsmPaused();
  const { data: ea } = useCsmEarlyAdoption();
  const { data: isPublicRelease } = useCsmPublicRelease();

  return Boolean(
    address &&
      !nodeOperatorId &&
      !paused?.isPaused &&
      (isPublicRelease || !!ea?.proof),
  );
};
