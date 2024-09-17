import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { getMaxBalanceToken } from 'utils';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useGetDefaultValues = ({
  etherBalance,
  stethBalance,
  wstethBalance,
  loading: {
    isEtherBalanceLoading,
    isStethBalanceLoading,
    isWstethBalanceLoading,
  },
}: AddKeysFormNetworkData) => {
  return useDefaultValues<AddKeysFormInputType>(
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
        depositData: [],
        rawDepositData: '',
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
