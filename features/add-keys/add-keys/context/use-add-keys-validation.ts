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
import type { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useAddKeysValidation = (networkData: AddKeysFormNetworkData) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const {
    csm: { depositData: sdk },
  } = useLidoSDK();

  return useCallback<Resolver<AddKeysFormInputType>>(
    async (values, _, options) => {
      const {
        token,
        bondAmount,
        depositData,
        rawDepositData,
        confirmKeysReady,
      } = values;

      const {
        stethBalance,
        wstethBalance,
        ethBalance,
        maxStakeEth,
        operatorInfo,
        curveParameters,
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
          currentActiveKeys:
            operatorInfo &&
            operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys,
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

      return resolve(values);
    },
    [dataPromise, sdk],
  );
};
