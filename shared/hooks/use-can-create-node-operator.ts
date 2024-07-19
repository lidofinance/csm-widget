import { useCsmEarlyAdoption } from './useCsmEarlyAdoption';
import { useCsmStatus } from './useCsmStatus';

export const useCanCreateNodeOperator = () => {
  const { data: ea } = useCsmEarlyAdoption();
  const { data: status } = useCsmStatus();
  return status?.isPublicRelease || !!ea?.proof;
};
