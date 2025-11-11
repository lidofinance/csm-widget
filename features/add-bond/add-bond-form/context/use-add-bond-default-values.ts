import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { getMaxBalanceToken } from 'modules/web3';
import { useFormDefaultValues } from 'shared/hook-form/form-controller';
import { AddBondFormInputType, AddBondFormNetworkData } from './types';

export const useAddBondDefaultValues = () => {
  return useFormDefaultValues<AddBondFormInputType, AddBondFormNetworkData>(
    (data) => ({
      token: getMaxBalanceToken({
        [TOKENS.eth]: data.ethBalance,
        [TOKENS.steth]: data.stethBalance,
        [TOKENS.wsteth]: data.wstethBalance,
      }),
    }),
  );
};
