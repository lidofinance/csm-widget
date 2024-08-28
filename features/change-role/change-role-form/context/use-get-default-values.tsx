import { useCallback, useMemo } from 'react';
import { useAwaiter } from 'shared/hooks';
import { ChangeRoleFormInputType, ChangeRoleFormNetworkData } from './types';

export const useGetDefaultValues = ({
  isManagerReset,
  address,
  loading: { isInfoLoading },
}: ChangeRoleFormNetworkData) => {
  const values: ChangeRoleFormInputType | undefined = useMemo(() => {
    if (isInfoLoading) return undefined;
    return {
      isRevoke: false,
      address: isManagerReset ? address : undefined,
    };
  }, [address, isInfoLoading, isManagerReset]);

  const { awaiter } = useAwaiter(values);

  return useCallback(() => awaiter, [awaiter]);
};
