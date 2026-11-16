import { PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useCorrectPath } from './use-correct-path';
import { useForwardedQuery } from './use-forwarded-query';
import { buildNavigateTarget } from './build-navigate-target';
import { useInpageNavigation } from 'providers/inpage-navigation';

export type NavigateOptions = { replace?: boolean };

export const useNavigate = (keepHash?: boolean) => {
  const { push, replace: replaceRoute } = useRouter();
  const correct = useCorrectPath();
  const forwarded = useForwardedQuery();
  const { hashNav } = useInpageNavigation();

  return useCallback(
    (
      path: PATH,
      query?: Record<string, string>,
      { replace }: NavigateOptions = {},
    ) => {
      const target = buildNavigateTarget({
        path,
        corrected: correct(path),
        forwarded,
        query,
        hash: keepHash ? hashNav : undefined,
      });
      return replace ? replaceRoute(target) : push(target);
    },
    [correct, forwarded, hashNav, keepHash, push, replaceRoute],
  );
};
