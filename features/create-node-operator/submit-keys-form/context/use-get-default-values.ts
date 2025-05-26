import { useMemo } from 'react';
import { Address } from 'viem';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useDefaultValues } from 'shared/hooks';

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
    ETH: ethBalance,
    stETH: stethBalance,
    wstETH: wstethBalance,
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

import { PerToken, TOKENS } from '@lidofinance/lido-csm-sdk/common';

type Props = Partial<PerToken<bigint>>;

const tokensOrder = [TOKENS.steth, TOKENS.wsteth, TOKENS.eth];
// TODO: convert wsteth amount
export const getMaxBalanceToken = (props: Props): TOKENS => {
  const balances = [props.stETH ?? 0n, props.wstETH ?? 0n, props.ETH ?? 0n];

  return tokensOrder[
    balances.indexOf(
      balances.reduce((max, val) => (max >= val ? max : val), 0n),
    )
  ];
};
