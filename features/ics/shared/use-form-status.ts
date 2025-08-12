import { useQuery } from '@tanstack/react-query';
import { useAuth } from './ics-auth-provider';
import { useIcsFetcher } from './use-ics-fetcher';

export type FormStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'draft';

export interface FormStatusResponse {
  status: FormStatus;
  submittedAt?: string;
  lastUpdated?: string;
  reviewNotes?: string;
  formData?: Record<string, unknown>;
}

export const useFormStatus = () => {
  const { token } = useAuth();
  const [fetcher] = useIcsFetcher<FormStatusResponse>();

  return useQuery({
    queryKey: ['ics-form-status'],
    queryFn: () => fetcher('forms/status'),
    enabled: !!token,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    retry: 1,
  });
};