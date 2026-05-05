import { useQuery } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'shared/siwe';
import { DvtResponseDto } from './types';
import { useDvtFetcher } from './use-dvt-fetcher';

export const DVT_FORM_STATUS_KEY = 'dvt-form-status';

export const useFormStatus = () => {
  const { token } = useSiweAuth();
  const [fetcher] = useDvtFetcher<DvtResponseDto>();

  return useQuery({
    queryKey: [DVT_FORM_STATUS_KEY, { token }],
    queryFn: () => fetcher('dvt/status'),
    enabled: !!token,
    ...STRATEGY_LAZY,
  });
};
