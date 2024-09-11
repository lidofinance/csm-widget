import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { getMaxBalanceToken } from 'utils';
import { AddBondFormInputType, AddBondFormNetworkData } from './types';

export const useGetDefaultValues = ({
  etherBalance,
  stethBalance,
  wstethBalance,
  loading: {
    isEtherBalanceLoading,
    isStethBalanceLoading,
    isWstethBalanceLoading,
  },
}: AddBondFormNetworkData) => {
  return useDefaultValues<AddBondFormInputType>(
    useMemo(() => {
      if (
        [
          isEtherBalanceLoading,
          isStethBalanceLoading,
          isWstethBalanceLoading,
        ].some(Boolean)
      ) {
        return undefined;
      }

      const token = getMaxBalanceToken({
        etherBalance,
        stethBalance,
        wstethBalance,
      });

      return {
        token,
      };
    }, [
      etherBalance,
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      stethBalance,
      wstethBalance,
    ]),
  );
};
