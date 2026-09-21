import { useQuery } from '@tanstack/react-query';
import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { STRATEGY_LAZY } from 'consts';
import { AddressValidationFile, standardFetcher } from 'utils';
import { getApiUrl } from './get-api-url';

export const useValidationFile = () =>
  useQuery<AddressValidationFile>({
    queryKey: ['address-validation-file'],
    queryFn: () =>
      standardFetcher(getApiUrl(API_ROUTES.VALIDATION_FILE), {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
      }),
    enabled: !config.ipfsMode,
    ...STRATEGY_LAZY,
    retry: 1,
  });
