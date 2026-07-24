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
import { useApiAddressValidation } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { AddressValidationFile, validateAddressLocally } from 'utils';
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
//   1. No address or ipfsMode  → valid
//   2. API enabled + responded → use API.isValid
//   3. validationFile present  → check against deny-list locally
//   4. Otherwise               → valid
//
// The server-side loader returns an empty deny-list when the file is
// missing/unreadable/malformed, so a broken file lets all addresses
// through and surfaces via logs + Prom metrics rather than blocking users.
export const AddressValidationProvider = ({
  children,
  validationFile,
}: {
  children: ReactNode;
  validationFile?: AddressValidationFile;
}) => {
  const validateAddressAPI = useApiAddressValidation();
  const queryClient = useQueryClient();
  const [isValidAddress, setIsValidAddress] = useState(true);

  // File validation query (works independently of API settings)
  const validateAddressFile = useCallback(
    async (addressToValidate: Address) => {
      if (!validationFile) {
        return { isValid: true };
      }

      const result = await queryClient.fetchQuery({
        queryKey: [
          'address-validation-file',
          addressToValidate,
          validationFile?.addresses?.length,
        ],
        queryFn: async () =>
          validateAddressLocally(addressToValidate, validationFile),
        staleTime: 1 * 60 * 1000, // 1 minute
      });

      return result;
    },
    [validationFile, queryClient],
  );

  const validateAddress = useCallback(
    async (addressToValidate?: Address) => {
      // If no address, consider valid
      if (!addressToValidate || config.ipfsMode) {
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
      if (validationFile) {
        const fileResult = await validateAddressFile(addressToValidate);
        setIsValidAddress(fileResult.isValid);
        return fileResult.isValid;
      }

      // Default to valid if no validation data available
      setIsValidAddress(true);
      return true;
    },
    [validateAddressAPI, validateAddressFile, validationFile],
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
