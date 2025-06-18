import { useShareLimit } from './use-share-limit';

export const useShareLimitPercentage = () => {
  return useShareLimit((data) => data.shareLimit);
};
