import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type SubmitKeysFormDataContextValue } from './types';

export const SubmitKeysFormDataContext =
  createContext<SubmitKeysFormDataContextValue | null>(null);
SubmitKeysFormDataContext.displayName = 'SubmitKeysFormDataContext';

export const useSubmitKeysFormData = () => {
  const value = useContext(SubmitKeysFormDataContext);
  invariant(
    value,
    'useSubmitKeysFormData was used outside the SubmitKeysFormDataContext provider',
  );
  return value;
};
