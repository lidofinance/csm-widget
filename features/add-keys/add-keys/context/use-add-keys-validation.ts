import { useLidoSDK } from 'modules/web3';
import {
  useFormValidation,
  validateBondAmount,
  validateDepositData,
  ValidationError,
} from 'shared/hook-form/validation';
import type { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useAddKeysValidation = () => {
  const {
    csm: { depositData: sdk },
  } = useLidoSDK();

  return useFormValidation<AddKeysFormInputType, AddKeysFormNetworkData>(
    'token',
    async (
      { token, bondAmount, depositData, rawDepositData, confirmKeysReady },
      {
        operatorInfo,
        curveParameters,
        maxStakeEth,
        ethBalance,
        stethBalance,
        wstethBalance,
      },
      validate,
    ) => {
      // FIXME: validate on submit that token, bondAmount and depositData.length are defined

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

      // TODO: validate length is zero
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

      // TODO: refactor this validation
      await validate(['rawDepositData', 'depositData'], async () => {
        await validateDepositData({
          depositData,
          sdk,
        });
      });

      await validate(['rawDepositData', 'depositData'], () => {
        const keysCount = depositData?.length ?? 0;
        const currentActiveKeys =
          operatorInfo &&
          operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys;

        const keysLimit = curveParameters?.keysLimit;

        if (
          keysLimit !== undefined &&
          currentActiveKeys !== undefined &&
          currentActiveKeys + keysCount > keysLimit
        ) {
          const availableSlots = Math.max(keysLimit - currentActiveKeys, 0);
          throw new ValidationError(
            'depositData',
            `Keys limit exceeded. Allowed keys count to submit: ${availableSlots}`,
          );
        }
      });

      await validate('confirmKeysReady', () => {
        if (!confirmKeysReady) {
          throw new ValidationError(
            'confirmKeysReady',
            'Please confirm that the keys are ready',
          );
        }
      });
    },
    [sdk],
  );
};
