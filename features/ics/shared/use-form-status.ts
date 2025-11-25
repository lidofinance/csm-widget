import { useQuery } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSiweAuth } from 'shared/siwe';
import { IcsResponseDto } from './types';
import { useIcsFetcher } from './use-ics-fetcher';

export const ICS_FORM_STATUS_KEY = 'ics-form-status';

export const useFormStatus = () => {
  const { token } = useSiweAuth();
  const [fetcher] = useIcsFetcher<IcsResponseDto>();

  return useQuery({
    queryKey: [ICS_FORM_STATUS_KEY, { token }],
    queryFn: () => fetcher('ics/status'),
    enabled: !!token,
    ...STRATEGY_LAZY,
  });
};
