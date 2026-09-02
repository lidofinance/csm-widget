import { useVisibleTypes } from './use-visible-types';

export const useShouldShowTypeModal = () => useVisibleTypes().length > 1;
