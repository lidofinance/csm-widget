import { useShareLimit } from './use-share-limit';

export const useShareLimitPercentage = () => {
  return useShareLimit({ select: (data) => data.shareLimit });
};
