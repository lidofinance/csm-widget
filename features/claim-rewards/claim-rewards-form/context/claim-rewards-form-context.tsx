import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type ClaimRewardsFormDataContextValue } from './types';

export const ClaimRewardsFormDataContext =
  createContext<ClaimRewardsFormDataContextValue | null>(null);
ClaimRewardsFormDataContext.displayName = 'ClaimRewardsFormDataContext';

export const useClaimRewardsFormData = () => {
  const value = useContext(ClaimRewardsFormDataContext);
  invariant(
    value,
    'useClaimRewardsFormData was used outside the ClaimRewardsFormDataContext provider',
  );
  return value;
};
