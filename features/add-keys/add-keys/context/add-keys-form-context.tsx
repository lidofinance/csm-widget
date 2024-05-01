import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type AddKeysFormDataContextValue } from './types';

export const AddKeysFormDataContext =
  createContext<AddKeysFormDataContextValue | null>(null);
AddKeysFormDataContext.displayName = 'AddKeysFormDataContext';

export const useAddKeysFormData = () => {
  const value = useContext(AddKeysFormDataContext);
  invariant(
    value,
    'useAddKeysFormData was used outside the AddKeysFormDataContext provider',
  );
  return value;
};
