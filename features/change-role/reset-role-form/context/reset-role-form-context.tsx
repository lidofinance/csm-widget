import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type ResetRoleFormDataContextValue } from './types';

export const ResetRoleFormDataContext =
  createContext<ResetRoleFormDataContextValue | null>(null);
ResetRoleFormDataContext.displayName = 'ResetRoleFormDataContext';

export const useResetRoleFormData = () => {
  const value = useContext(ResetRoleFormDataContext);
  invariant(
    value,
    'useResetRoleFormData was used outside the ResetRoleFormDataContext provider',
  );
  return value;
};
