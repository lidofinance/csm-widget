import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Address } from 'viem';

import { API_ROUTES } from 'consts/api';
import { config } from 'config';
import { standardFetcher } from 'utils';
import { getApiUrl } from './get-api-url';

export const useApiAddressValidation = () => {
  const queryClient = useQueryClient();

  const validateAddressAPI = useCallback(
    async (addressToValidate: Address) => {
      if (!config.addressApiValidationEnabled) {
        return { isValid: true };
      }

      const result = await queryClient.fetchQuery<{ isValid: boolean } | null>({
        queryKey: ['address-validation-api', addressToValidate],
        queryFn: async () => {
          try {
            const url = getApiUrl(API_ROUTES.VALIDATION, {
              address: addressToValidate,
            });
            return await standardFetcher(url, {
              method: 'GET',
              headers: {
                'Content-type': 'application/json',
                source: 'csm',
              },
            });
          } catch (error) {
            return null;
          }
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: 1,
      });

      return result;
    },
    [queryClient],
  );

  return validateAddressAPI;
};
