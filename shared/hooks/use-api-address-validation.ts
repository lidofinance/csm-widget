import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Address } from 'viem';

import { API_ROUTES } from 'consts/api';
import { config } from 'config';
import { FetcherError, standardFetcher } from 'utils';
import { getApiUrl } from 'utils/get-api-url';

export const useApiAddressValidation = () => {
  const queryClient = useQueryClient();

  const validateAddressAPI = useCallback(
    async (addressToValidate: Address): Promise<boolean> => {
      if (!config.addressValidationEnabled) {
        return true;
      }

      try {
        return await queryClient.fetchQuery<boolean>({
          queryKey: ['address-validation-api', addressToValidate],
          queryFn: async () => {
            const url = getApiUrl(API_ROUTES.VALIDATION, {
              address: addressToValidate,
            });
            const data = await standardFetcher<{ isValid?: unknown }>(url, {
              method: 'GET',
              headers: {
                'Content-type': 'application/json',
                source: 'csm',
              },
            });
            if (typeof data?.isValid !== 'boolean') {
              throw new Error('Malformed address validation response');
            }
            return data.isValid;
          },
          staleTime: 1 * 60 * 1000, // 1 minute
          retry: (failureCount, error) =>
            failureCount < 1 &&
            !(error instanceof FetcherError && error.status === 429),
        });
      } catch {
        return false;
      }
    },
    [queryClient],
  );

  return validateAddressAPI;
};
