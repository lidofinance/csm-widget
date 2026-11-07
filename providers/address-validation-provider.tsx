import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { STRATEGY_LAZY } from 'consts';
import { useApiAddressValidation } from 'shared/hooks';
import invariant from 'tiny-invariant';
import {
  AddressValidationFile,
  standardFetcher,
  validateAddressLocally,
} from 'utils';
import { getApiUrl } from 'utils/get-api-url';
import { Address } from 'viem';

const validationFileQuery = {
  queryKey: ['address-validation-file'],
  queryFn: (): Promise<AddressValidationFile> =>
    standardFetcher(getApiUrl(API_ROUTES.VALIDATION_FILE), {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    }),
  ...STRATEGY_LAZY,
  retry: 1,
};

const AddressValidationContext = createContext<{
  isValidAddress: boolean;
  resetIsValidAddress: () => void;
  validateAddress: (address?: Address) => Promise<boolean>;
}>({
  isValidAddress: true,
  resetIsValidAddress: () => {},
  validateAddress: async () => {
    return true;
  },
});
AddressValidationContext.displayName = 'AddressValidationContext';

export const useAddressValidation = () => {
  const value = useContext(AddressValidationContext);
  invariant(
    value !== null,
    'useAddressValidation was used outside of AddressValidationProvider',
  );
  return value;
};

// Resolution priority:
//   1. No address               → valid
//   2. API enabled + responded → use API.isValid
//      (any 429 = client over a rate limit: invalid, no fallback)
//   3. validationFile present  → check against deny-list locally
//   4. Otherwise               → valid
//
// The deny-list file is prefetched and awaited at validation time; a failed fetch counts as absent.
export const AddressValidationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const validateAddressAPI = useApiAddressValidation();
  const queryClient = useQueryClient();
  const [isValidAddress, setIsValidAddress] = useState(true);

  useEffect(() => {
    void queryClient.prefetchQuery(validationFileQuery);
  }, [queryClient]);

  const validateAddress = useCallback(
    async (addressToValidate?: Address) => {
      // If no address, consider valid
      if (!addressToValidate) {
        setIsValidAddress(true);
        return true;
      }

      if (config.addressApiValidationEnabled) {
        const apiResult = await validateAddressAPI(addressToValidate);

        // API responded successfully - use API result
        if (apiResult !== null && apiResult.isValid !== undefined) {
          setIsValidAddress(apiResult.isValid);
          return apiResult.isValid;
        }
      }

      // Fallback to file validation if available
      const validationFile = await queryClient
        .fetchQuery(validationFileQuery)
        .catch(() => undefined);
      if (validationFile) {
        const fileResult = validateAddressLocally(
          addressToValidate,
          validationFile,
        );
        setIsValidAddress(fileResult.isValid);
        return fileResult.isValid;
      }

      // Default to valid if no validation data available
      setIsValidAddress(true);
      return true;
    },
    [validateAddressAPI, queryClient],
  );

  const resetIsValidAddress = useCallback(() => {
    setIsValidAddress(true);
  }, []);

  const value = useMemo(
    () => ({
      isValidAddress,
      resetIsValidAddress,
      validateAddress,
    }),
    [isValidAddress, resetIsValidAddress, validateAddress],
  );

  return (
    <AddressValidationContext.Provider value={value}>
      {children}
    </AddressValidationContext.Provider>
  );
};
