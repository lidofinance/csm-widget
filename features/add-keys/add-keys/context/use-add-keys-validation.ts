import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateDepositData,
} from 'shared/hook-form/validation';
import { useAccount, useAwaitNetworkData } from 'shared/hooks';
import type { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useAddKeysValidation = (networkData: AddKeysFormNetworkData) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const { chainId } = useAccount();

  return useCallback<Resolver<AddKeysFormInputType>>(
    async (values, _, options) => {
      try {
        const { token, bondAmount, depositData } = values;

        const { stethBalance, wstethBalance, etherBalance, maxStakeEther } =
          await dataPromise;

        if (options.names?.includes('bondAmount'))
          validateBondAmount({
            token,
            bondAmount,
            maxStakeEther,
            etherBalance,
            stethBalance,
            wstethBalance,
          });

        if (options.names?.includes('depositData'))
          await validateDepositData({ depositData, chainId });

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'SubmitKeysForm',
          'referral',
        );
      }
    },
    [chainId, dataPromise],
  );
};
