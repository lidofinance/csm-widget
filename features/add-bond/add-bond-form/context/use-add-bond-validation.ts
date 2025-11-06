import {
  useFormValidation,
  validateBondAmount,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import type { AddBondFormInputType, AddBondFormNetworkData } from './types';
// import invaria t from 'tiny-invariant';

export const useAddBondValidation = () => {
  return useFormValidation<AddBondFormInputType, AddBondFormNetworkData>(
    'token',
    async ({ token, bondAmount }, data, validate) => {
      // invariant(token !== undefined, 'Token is not defined');
      // invariant(bondAmount !== undefined, 'BondAmount is not defined');

      await validate(['token', 'bondAmount'], () =>
        validateBondAmount({
          token,
          bondAmount,
          maxStakeEth: data.maxStakeEth,
          ethBalance: data.ethBalance,
          stethBalance: data.stethBalance,
          wstethBalance: data.wstethBalance,
        }),
      );

      await validate('bondAmount', () =>
        validateEtherAmount('bondAmount', bondAmount, token),
      );
    },
  );
};
