import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { config } from 'config';
import { useApiAddressValidation, useValidationFile } from 'shared/hooks';
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
//   1. No address             → valid
//   2. API enabled + responded → use API.isValid
//   3. validationFile present  → check against deny-list locally
//   4. Otherwise               → valid
//
// The file comes from /api/validation-file; while it's loading or the fetch
// fails, treat it as absent (valid) rather than blocking the UI. The
// server-side loader behind it returns an empty deny-list when the file is
// missing/unreadable/malformed, so a broken file lets all addresses
// through and surfaces via logs + Prom metrics rather than blocking users.
export const AddressValidationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const validateAddressAPI = useApiAddressValidation();
  const { data: validationFile } = useValidationFile();
  const [isValidAddress, setIsValidAddress] = useState(true);

  const validateAddressFile = useCallback(
    (addressToValidate: Address) => {
      if (!validationFile) {
        return { isValid: true };
      }

      return validateAddressLocally(addressToValidate, validationFile);
    },
    [validationFile],
  );

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
      if (validationFile) {
        const fileResult = validateAddressFile(addressToValidate);
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
