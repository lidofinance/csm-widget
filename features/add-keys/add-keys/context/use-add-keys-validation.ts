import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateDepositData,
  ValidationError,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import type { AddKeysFormInputType, AddKeysFormNetworkData } from './types';
import { useDappStatus } from 'modules/web3';

export const useAddKeysValidation = (networkData: AddKeysFormNetworkData) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const { chainId } = useDappStatus();

  return useCallback<Resolver<AddKeysFormInputType>>(
    async (values, _, options) => {
      try {
        const { token, bondAmount, depositData, confirmKeysReady } = values;

        const {
          stethBalance,
          wstethBalance,
          ethBalance,
          maxStakeEth,
          blockNumber,
          operatorInfo,
          curveParameters,
        } = await dataPromise;

        validateBondAmount({
          token,
          bondAmount,
          maxStakeEth,
          ethBalance,
          stethBalance,
          wstethBalance,
        });

        if (
          options.names?.includes('depositData') ||
          options.names?.includes('rawDepositData')
        ) {
          await validateDepositData({
            depositData,
            chainId,
            blockNumber,
          });

          if (
            depositData &&
            operatorInfo &&
            curveParameters?.keysLimit !== undefined
          ) {
            const keysCount = depositData.length;
            const currentActiveKeys =
              operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys;
            const { keysLimit } = curveParameters;

            if (currentActiveKeys + keysCount > keysLimit) {
              const availableSlots = Math.max(keysLimit - currentActiveKeys, 0);
              throw new ValidationError(
                'depositData',
                `Keys limit exceeded. Allowed keys count to submit: ${availableSlots}`,
              );
            }
          }
        }

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
