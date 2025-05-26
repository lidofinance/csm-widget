import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateDepositData,
  ValidationError,
} from 'shared/hook-form/validation';
import { useAccount, useAwaitNetworkData } from 'shared/hooks';
import type { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useAddKeysValidation = (networkData: AddKeysFormNetworkData) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const { chainId } = useAccount();

  return useCallback<Resolver<AddKeysFormInputType>>(
    async (values, _, options) => {
      try {
        const { token, bondAmount, depositData, confirmKeysReady } = values;

        const {
          stethBalance,
          wstethBalance,
          etherBalance,
          maxStakeEther,
          blockNumber,
        } = await dataPromise;

        validateBondAmount({
          token,
          bondAmount,
          maxStakeEth: maxStakeEther,
          ethBalance: etherBalance,
          stethBalance,
          wstethBalance,
        });

        if (
          options.names?.includes('depositData') ||
          options.names?.includes('rawDepositData')
        )
          await validateDepositData({
            depositData,
            chainId,
            blockNumber,
          });

        if (options.names?.includes('confirmKeysReady') && !confirmKeysReady) {
          throw new ValidationError(
            'confirmKeysReady',
            'Please confirm that the keys are ready',
          );
        }

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'AddKeysForm',
          'depositData',
        );
      }
    },
    [chainId, dataPromise],
  );
};
