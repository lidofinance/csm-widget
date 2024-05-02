import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type ClaimBondFormDataContextValue } from './types';

export const ClaimBondFormDataContext =
  createContext<ClaimBondFormDataContextValue | null>(null);
ClaimBondFormDataContext.displayName = 'ClaimBondFormDataContext';

export const useClaimBondFormData = () => {
  const value = useContext(ClaimBondFormDataContext);
  invariant(
    value,
    'useClaimBondFormData was used outside the ClaimBondFormDataContext provider',
  );
  return value;
};
