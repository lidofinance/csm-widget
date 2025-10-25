import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { getMaxBalanceToken } from 'modules/web3';
import { useFormDefaultValues } from 'shared/hook-form/form-controller';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useAddKeysDefaultValues = () => {
  return useFormDefaultValues<AddKeysFormInputType, AddKeysFormNetworkData>(
    (data) => ({
      token: getMaxBalanceToken({
        [TOKENS.eth]: data.ethBalance,
        [TOKENS.steth]: data.stethBalance,
        [TOKENS.wsteth]: data.wstethBalance,
      }),
      depositData: [],
      rawDepositData: '',
      confirmKeysReady: false,
    }),
  );
};
