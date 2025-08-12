import { useQuery } from '@tanstack/react-query';
import { useAuth } from './ics-auth-provider';
import { useIcsFetcher } from './use-ics-fetcher';
import { STRATEGY_EAGER } from 'consts';
import { IcsResponseDto } from './types';

export const ICS_FORM_STATUS_KEY = 'ics-form-status';

export const useFormStatus = () => {
  const { token } = useAuth();
  const [fetcher] = useIcsFetcher<IcsResponseDto>();

  return useQuery({
    queryKey: [ICS_FORM_STATUS_KEY, { token }],
    queryFn: () => fetcher('ics/status'),
    enabled: !!token,
    ...STRATEGY_EAGER,
  });
};
