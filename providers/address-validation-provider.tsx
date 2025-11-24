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
    'useAddressValidation was used used outside of AddressValidationProvider',
  );
  return value;
};

/*
 * ADDRESS VALIDATION PROVIDER LOGIC
 *
 * APPROACH: Manual function calls (not automatic useQuery)
 * - validateAddress(address) is called manually when user performs action
 * - Uses queryClient.fetchQuery() for caching
 * - Sequential execution: API first, then file validation as fallback
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │        User action triggers validateAddress(address)                │
 * │        (e.g. submit button click before form submission)            │
 * └─────────────────────┬───────────────────────────────────────────────┘
 *                       │
 *                       ▼
 *           ┌───────────────────────────┐
 *           │ !addressToValidate ||     │
 *           │ config.ipfsMode?          │
 *           └───┬───────────────────┬───┘
 *               │ YES               │ NO
 *               ▼                   ▼
 *        ┌─────────────┐    ┌──────────────────────────┐
 *        │ set=true    │    │ addressApi               │
 *        │ return true │    │ ValidationEnabled?       │
 *        └─────────────┘    └──────┬───────────────────┘
 *                                  │
 *                   ┌──────────────┴──────────────┐
 *                   │ TRUE                        │ FALSE
 *                   ▼                             ▼
 *      ┌────────────────────────┐    ┌────────────────────────┐
 *      │ await validateAddress  │    │ validationFile?        │
 *      │ API(address)           │    └────┬───────────────┬───┘
 *      └────────┬───────────────┘         │ NO            │ YES
 *               │                         ▼               ▼
 *               ▼                   ┌──────────┐    ┌─────────────────┐
 *    ┌──────────────────────┐      │ set=true │    │ await validate  │
 *    │ Result type?         │      │ return   │    │ AddressFile()   │
 *    └──┬───────────────┬───┘      │ true     │    │ ┌─────────────┐ │
 *       │               │          └──────────┘    │ │queryFn:     │ │
 *       │ !== null &&   │ === null                 │ │ if broken → │ │
 *       │ has isValid   │                          │ │   false     │ │
 *       ▼               ▼                          │ │ else →      │ │
 *  ┌──────────┐  ┌──────────────┐                 │ │ validateLoc-│ │
 *  │ set=API  │  │ validationFi-│                 │ │ ally()      │ │
 *  │ .isValid │  │ le?          │                 │ └─────────────┘ │
 *  │ return   │  └──┬────────┬──┘                 └────────┬────────┘
 *  │ API      │     │ NO     │ YES                         │
 *  │ .isValid │     ▼        ▼                             ▼
 *  └──────────┘  ┌──────┐ ┌─────────────────┐      ┌──────────────┐
 *                │set=  │ │ await validate  │      │ set=file     │
 *                │true  │ │ AddressFile()   │      │ .isValid     │
 *                │return│ │ ┌─────────────┐ │      │ return file  │
 *                │true  │ │ │queryFn:     │ │      │ .isValid     │
 *                └──────┘ │ │ if broken → │ │      └──────────────┘
 *                         │ │   false     │ │
 *                         │ │ else →      │ │
 *                         │ │ validateLoc-│ │
 *                         │ │ ally()      │ │
 *                         │ └─────────────┘ │
 *                         └────────┬────────┘
 *                                  │
 *                                  ▼
 *                          ┌──────────────┐
 *                          │ set=file     │
 *                          │ .isValid     │
 *                          │ return file  │
 *                          │ .isValid     │
 *                          └──────────────┘
 *
 * ALL POSSIBLE OUTCOMES:
 * 1. No address / ipfsMode → return true
 * 2. API enabled + success → return API.isValid
 * 3. API enabled + error + file exists → return file.isValid
 * 4. API enabled + error + NO file → return true (DEFAULT)
 * 5. API disabled + file exists → return file.isValid
 * 6. API disabled + NO file → return true (DEFAULT)
 *
 * PRIORITY ORDER:
 * 1. API result (when enabled & successful: result !== null && isValid defined)
 * 2. File validation (fallback when API error, or when API disabled)
 *    - If file.isBroken = true → { isValid: false }
 *    - Otherwise → validateAddressLocally()
 * 3. Default: true (when no validation sources available)
 *
 * CACHING (via queryClient.fetchQuery):
 * - API validation: cached per address for 1 minute
 * - File validation: cached per address + file metadata for 1 minute
 * - Repeated calls use cached results
 */

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
          validationFile?.isBroken,
        ],
        queryFn: async () => {
          // If validation file is broken, consider all addresses invalid
          if (validationFile.isBroken) return { isValid: false };

          return validateAddressLocally(addressToValidate, validationFile);
        },
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
