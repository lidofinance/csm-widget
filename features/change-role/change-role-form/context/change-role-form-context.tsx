import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type ChangeRoleFormDataContextValue } from './types';

export const ChangeRoleFormDataContext =
  createContext<ChangeRoleFormDataContextValue | null>(null);
ChangeRoleFormDataContext.displayName = 'ChangeRoleFormDataContext';

export const useChangeRoleFormData = () => {
  const value = useContext(ChangeRoleFormDataContext);
  invariant(
    value,
    'useChangeRoleFormData was used outside the ChangeRoleFormDataContext provider',
  );
  return value;
};
