import { useMemo } from 'react';
import { useDefaultValues } from 'shared/hooks';
import { AddBondFormInputType, AddBondFormNetworkData } from './types';
import { getMaxBalanceToken } from 'modules/web3';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const useGetDefaultValues = ({
  ethBalance,
  stethBalance,
  wstethBalance,
  loading: {
    isEthBalanceLoading,
    isStethBalanceLoading,
    isWstethBalanceLoading,
  },
}: AddBondFormNetworkData) => {
  return useDefaultValues<AddBondFormInputType>(
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
