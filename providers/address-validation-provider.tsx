import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useApiAddressValidation } from 'shared/hooks';
import invariant from 'tiny-invariant';
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

// Resolution (deny-list file and validation service are both checked server-side):
//   no address or validation disabled → valid
//   verdict from /api/validation      → use it
//   any failure                       → invalid (fail closed)
export const AddressValidationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const validateAddressAPI = useApiAddressValidation();
  const [isValidAddress, setIsValidAddress] = useState(true);

  const validateAddress = useCallback(
    async (addressToValidate?: Address) => {
      const isValid =
        !addressToValidate || (await validateAddressAPI(addressToValidate));
      setIsValidAddress(isValid);
      return isValid;
    },
    [validateAddressAPI],
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
