import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateEtherAmount,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import type { AddBondFormInputType, AddBondFormNetworkData } from './types';

export const useAddBondValidation = (networkData: AddBondFormNetworkData) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<AddBondFormInputType>>(
    async (values) => {
      try {
        const { token, bondAmount } = values;

        const { stethBalance, wstethBalance, ethBalance, maxStakeEth } =
          await dataPromise;

        validateBondAmount({
          token,
          bondAmount,
          maxStakeEth,
          ethBalance,
          stethBalance,
          wstethBalance,
        });
        validateEtherAmount('bondAmount', bondAmount, token);

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(error, 'AddBondForm', 'token');
      }
    },
    [dataPromise],
  );
};
