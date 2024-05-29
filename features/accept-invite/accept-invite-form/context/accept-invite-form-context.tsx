import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type AcceptInviteFormDataContextValue } from './types';

export const AcceptInviteFormDataContext =
  createContext<AcceptInviteFormDataContextValue | null>(null);
AcceptInviteFormDataContext.displayName = 'AcceptInviteFormDataContext';

export const useAcceptInviteFormData = () => {
  const value = useContext(AcceptInviteFormDataContext);
  invariant(
    value,
    'useAcceptInviteFormData was used outside the AcceptInviteFormDataContext provider',
  );
  return value;
};
