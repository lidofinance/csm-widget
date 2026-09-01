import { useRequestedOperatorType } from 'shared/hooks';
import { useVisibleTypes } from './use-visible-types';

export const useShouldShowTypeModal = () => {
  const types = useVisibleTypes();
  const requestedType = useRequestedOperatorType();
  return !requestedType && types.length > 1;
};
