import { useMemo } from 'react';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import {
  ChangeRoleFormNetworkData,
  ChangeRoleFormValidationContext,
} from './types';

export const useChangeRoleFormValidationContext = (
  networkData: ChangeRoleFormNetworkData,
): Promise<ChangeRoleFormValidationContext> => {
  const { currentAddress, proposedAddress } = networkData;

  const asyncContextValue: ChangeRoleFormValidationContext | undefined =
    useMemo(() => {
      return currentAddress
        ? {
            currentAddress,
            proposedAddress,
          }
        : undefined;
    }, [currentAddress, proposedAddress]);

  return useAwaiter(asyncContextValue).awaiter;
};
