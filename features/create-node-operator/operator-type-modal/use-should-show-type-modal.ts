import { useRequestedOperatorType } from 'shared/hooks';
import { useVisibleTypes } from './use-visible-types';

export const useShouldShowTypeModal = () => {
  const types = useVisibleTypes();
  const { isRequested } = useRequestedOperatorType();
  return !isRequested && types.length > 1;
};
