import { useRouter } from 'next/router';
import { useCallback } from 'react';
import {
  resolveStatusFilter,
  StatusChip,
  StatusChipId,
} from './get-status-chips';

export const useStatusFilter = (chips: StatusChip[]) => {
  const router = useRouter();
  const status = router.isReady
    ? resolveStatusFilter(router.query.status, chips)
    : undefined;

  const setStatus = useCallback(
    (id: StatusChipId | undefined) => {
      const { status: _status, ...query } = router.query;
      void router.replace(
        {
          pathname: router.pathname,
          query: id ? { ...query, status: id } : query,
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return { status, setStatus };
};
