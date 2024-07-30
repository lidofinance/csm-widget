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
    async (values, _, options) => {
      try {
        const { token, bondAmount } = values;

        const { stethBalance, wstethBalance, etherBalance, maxStakeEther } =
          await dataPromise;

        if (options.names?.includes('bondAmount') && bondAmount?.gt(0)) {
          validateBondAmount({
            token,
            bondAmount,
            maxStakeEther,
            etherBalance,
            stethBalance,
            wstethBalance,
          });
          validateEtherAmount('bondAmount', bondAmount, token);
        }

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
