import { useCsmEarlyAdoption } from './useCsmEarlyAdoption';
import { useCsmPublicRelease } from './useCsmStatus';

export const useCanCreateNodeOperator = () => {
  const { data: ea } = useCsmEarlyAdoption();
  const { data: isPublicRelease } = useCsmPublicRelease();
  return isPublicRelease || !!ea?.proof;
};
