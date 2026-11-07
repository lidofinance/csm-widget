import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { config } from 'config';
import {
  useApiAddressValidation,
  useValidationFile,
  validationFileQuery,
} from 'shared/hooks';
import invariant from 'tiny-invariant';
import { validateAddressLocally } from 'utils';
import { Address } from 'viem';

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
// The file comes from /api/validation-file and is awaited at validation time;
// only a failed fetch counts as absent (valid). The loader behind it returns an
// empty list for a missing/malformed file, surfaced via logs + Prom metrics.
export const AddressValidationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const validateAddressAPI = useApiAddressValidation();
  const queryClient = useQueryClient();
  useValidationFile();
  const [isValidAddress, setIsValidAddress] = useState(true);

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
