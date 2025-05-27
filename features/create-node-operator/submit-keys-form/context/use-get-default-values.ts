import { useMemo } from 'react';
import { Address } from 'viem';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useDefaultValues } from 'shared/hooks';
import { getMaxBalanceToken } from 'modules/web3';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const useGetDefaultValues = (
  {
    ethBalance,
    stethBalance,
    wstethBalance,
    loading: {
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
    },
  }: SubmitKeysFormNetworkData,
  referrer?: Address,
) => {
  const token = getMaxBalanceToken({
    [TOKENS.eth]: ethBalance,
    [TOKENS.steth]: stethBalance,
    [TOKENS.wsteth]: wstethBalance,
  });

  return useDefaultValues<SubmitKeysFormInputType>(
    useMemo(() => {
      if (
        [
          isEthBalanceLoading,
          isStethBalanceLoading,
          isWstethBalanceLoading,
        ].some(Boolean)
      ) {
        return undefined;
      }

      return {
        token,
        depositData: [],
        rawDepositData: '',
        confirmKeysReady: false,
        extendedManagerPermissions: false,
        specifyCustomAddresses: false,
        specifyReferrrer: false,
        referrer,
      };
    }, [
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      referrer,
      token,
    ]),
  );
};
