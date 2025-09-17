import { useDappStatus } from 'modules/web3';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateDepositData,
  ValidationError,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import { isAddress } from 'viem';
import type {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from './types';

export const useSubmitKeysValidation = (
  networkData: SubmitKeysFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const { chainId } = useDappStatus();

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
          ethBalance,
          maxStakeEth: maxStakeEther,
          blockNumber,
          curveParameters,
        } = await dataPromise;

        validateBondAmount({
          token,
          bondAmount,
          maxStakeEth: maxStakeEther,
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

          if (depositData && curveParameters?.keysLimit !== undefined) {
            const keysCount = depositData.length;
            const { keysLimit } = curveParameters;

            if (keysCount > keysLimit) {
              throw new ValidationError(
                'depositData',
                `Keys limit exceeded. Allowed keys count to submit: ${keysLimit}`,
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
