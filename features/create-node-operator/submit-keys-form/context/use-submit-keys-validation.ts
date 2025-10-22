import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  initValidator,
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
  const {
    csm: { depositData: sdk },
  } = useLidoSDK();

  return useCallback<Resolver<SubmitKeysFormInputType>>(
    async (values, _, options) => {
      const {
        token,
        bondAmount,
        depositData,
        rawDepositData,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        confirmKeysReady,
      } = values;

      const {
        stethBalance,
        wstethBalance,
        curveParameters,
        ethBalance,
        maxStakeEth,
      } = await dataPromise;

      const { validate, resolve } = initValidator(options, 'token');

      await validate(['token', 'bondAmount'], () =>
        validateBondAmount({
          token,
          bondAmount,
          maxStakeEth,
          ethBalance,
          stethBalance,
          wstethBalance,
        }),
      );

      await validate('rawDepositData', () => {
        if (rawDepositData) {
          const { error } = sdk.parseDepositData(rawDepositData);
          if (error) {
            throw new ValidationError('rawDepositData', error);
          }
        } else {
          throw new ValidationError('rawDepositData', '');
        }
      });

      await validate(['rawDepositData', 'depositData'], async () => {
        await validateDepositData({
          depositData,
          sdk,
          keysLimit: curveParameters?.keysLimit,
        });
      });

      await validate('confirmKeysReady', () => {
        if (!confirmKeysReady) {
          throw new ValidationError(
            'confirmKeysReady',
            'Please confirm that the keys are ready',
          );
        }
      });

      await validate('rewardsAddress', () => {
        if (specifyCustomAddresses && !isAddress(rewardsAddress ?? '')) {
          throw new ValidationError(
            'rewardsAddress',
            'Specify valid Rewards Address',
          );
        }
      });

      await validate('managerAddress', () => {
        if (specifyCustomAddresses && !isAddress(managerAddress ?? '')) {
          throw new ValidationError(
            'managerAddress',
            'Specify valid Manager Address',
          );
        }
      });

      return resolve(values);
    },
    [dataPromise, sdk],
  );
};
