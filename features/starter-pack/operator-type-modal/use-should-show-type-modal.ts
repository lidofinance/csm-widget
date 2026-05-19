import { useVisibleTypes } from './use-visible-types';

export const useShouldShowTypeModal = () => {
  const types = useVisibleTypes();
  return types.length > 1;
};
