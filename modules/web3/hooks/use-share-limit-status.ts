import { useShareLimit } from './use-share-limit';

export const SHARE_LIMIT_STATUS = {
  FAR: 'FAR',
  APPROACHING: 'APPROACHING',
  EXHAUSTED: 'EXHAUSTED',
  REACHED: 'REACHED',
} as const;

export const SHARE_LIMIT_APPROACHING_THRESHOLD = 200n;

export const useShareLimitStatus = () => {
  return useShareLimit((data) =>
    data.activeLeft <= 0
      ? SHARE_LIMIT_STATUS.REACHED
      : data.activeLeft - data.queue < 0
        ? SHARE_LIMIT_STATUS.EXHAUSTED
        : data.activeLeft - data.queue < SHARE_LIMIT_APPROACHING_THRESHOLD
          ? SHARE_LIMIT_STATUS.APPROACHING
          : SHARE_LIMIT_STATUS.FAR,
  );
};
