import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type RemoveKeysFormDataContextValue } from './types';

export const RemoveKeysFormDataContext =
  createContext<RemoveKeysFormDataContextValue | null>(null);
RemoveKeysFormDataContext.displayName = 'RemoveKeysFormDataContext';

export const useRemoveKeysFormData = () => {
  const value = useContext(RemoveKeysFormDataContext);
  invariant(
    value,
    'useRemoveKeysFormData was used outside the RemoveKeysFormDataContext provider',
  );
  return value;
};
