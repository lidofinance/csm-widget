import { useLidoSWR } from '@lido-sdk/react';
import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { standardFetcher } from 'utils';
import { useAccount } from 'wagmi';

interface AddressValidationResponse {
  isValid: boolean;
}

const getApiUrl = (route: string, params?: Record<string, string>) => {
  // Simple: always use full URL with current origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  let url = `${baseUrl}/${route}`;

  // Add query parameters
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  return url;
};

export const useApiAddressValidation = () => {
  const { address } = useAccount();

  return useLidoSWR(
    ['address-validation', address],
    config.addressApiValidationEnabled
      ? () => {
          const url = getApiUrl(API_ROUTES.VALIDATION, {
            address: address ?? '',
          });

          return standardFetcher<AddressValidationResponse>(url);
        }
      : null,
    {
      ...STRATEGY_LAZY,
      errorRetryCount: 1,
    },
  );
};
