import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type AddBondFormDataContextValue } from './types';

export const AddBondFormDataContext =
  createContext<AddBondFormDataContextValue | null>(null);
AddBondFormDataContext.displayName = 'AddBondFormDataContext';

export const useAddBondFormData = () => {
  const value = useContext(AddBondFormDataContext);
  invariant(
    value,
    'useAddBondFormData was used outside the AddBondFormDataContext provider',
  );
  return value;
};
