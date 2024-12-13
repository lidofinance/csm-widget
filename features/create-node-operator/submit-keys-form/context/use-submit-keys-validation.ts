import { isAddress } from 'ethers/lib/utils.js';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateDepositData,
  ValidationError,
} from 'shared/hook-form/validation';
import { useAccount, useAwaitNetworkData } from 'shared/hooks';
import type {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from './types';

export const useSubmitKeysValidation = (
  networkData: SubmitKeysFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const { chainId } = useAccount();

  return useCallback<Resolver<SubmitKeysFormInputType>>(
    async (values, _, options) => {
      try {
        const {
          token,
          bondAmount,
          depositData,
          specifyCustomAddresses,
          rewardsAddress,
          managerAddress,
          confirmKeysReady,
        } = values;

        const {
          stethBalance,
          wstethBalance,
          etherBalance,
          maxStakeEther,
          keysUploadLimit,
          blockNumber,
        } = await dataPromise;

        validateBondAmount({
          token,
          bondAmount,
          maxStakeEther,
          etherBalance,
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
            keysUploadLimit,
            blockNumber,
          });

        if (options.names?.includes('confirmKeysReady') && !confirmKeysReady) {
          throw new ValidationError(
            'confirmKeysReady',
            'Confirm that keys are ready',
          );
        }

        if (specifyCustomAddresses) {
          if (
            options.names?.includes('rewardsAddress') &&
            !isAddress(rewardsAddress ?? '')
          ) {
            throw new ValidationError(
              'rewardsAddress',
              'Specify valid Rewards Address',
            );
          }

          if (
            options.names?.includes('managerAddress') &&
            !isAddress(managerAddress ?? '')
          ) {
            throw new ValidationError(
              'managerAddress',
              'Specify valid Manager Address',
            );
          }
        }

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(error, 'SubmitKeysForm', 'token');
      }
    },
    [chainId, dataPromise],
  );
};
