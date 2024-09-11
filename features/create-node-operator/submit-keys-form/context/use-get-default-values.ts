import { useMemo } from 'react';
import { getMaxBalanceToken } from 'utils';
import { Address } from 'wagmi';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useDefaultValues } from 'shared/hooks';

export const useGetDefaultValues = (
  {
    etherBalance,
    stethBalance,
    wstethBalance,
    loading: {
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
    },
  }: SubmitKeysFormNetworkData,
  referrer?: Address,
) => {
  return useDefaultValues<SubmitKeysFormInputType>(
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
        extendedManagerPermissions: false,
        specifyCustomAddresses: false,
        specifyReferrrer: false,
        referrer,
      };
    }, [
      etherBalance,
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      referrer,
      stethBalance,
      wstethBalance,
    ]),
  );
};
