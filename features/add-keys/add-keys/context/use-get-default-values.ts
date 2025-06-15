import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';
import { getMaxBalanceToken } from 'modules/web3';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const useGetDefaultValues = ({
  ethBalance,
  stethBalance,
  wstethBalance,
  loading: {
    isEthBalanceLoading,
    isStethBalanceLoading,
    isWstethBalanceLoading,
  },
}: AddKeysFormNetworkData) => {
  return useDefaultValues<AddKeysFormInputType>(
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

      const token = getMaxBalanceToken({
        [TOKENS.eth]: ethBalance,
        [TOKENS.steth]: stethBalance,
        [TOKENS.wsteth]: wstethBalance,
      });

      return {
        token,
        depositData: [],
        rawDepositData: '',
        confirmKeysReady: false,
      };
    }, [
      ethBalance,
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      stethBalance,
      wstethBalance,
    ]),
  );
};
