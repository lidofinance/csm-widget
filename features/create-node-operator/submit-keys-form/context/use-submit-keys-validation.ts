import { useLidoSDK } from 'modules/web3';
import {
  useFormValidation,
  validateBondAmount,
  validateDepositData,
  ValidationError,
} from 'shared/hook-form/validation';
import { isAddress } from 'viem';
import type {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from './types';

export const useSubmitKeysValidation = () => {
  const {
    csm: { depositData: sdk },
  } = useLidoSDK();

  return useFormValidation<SubmitKeysFormInputType, SubmitKeysFormNetworkData>(
    'token',
    async (
      {
        token,
        bondAmount,
        depositData,
        rawDepositData,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        confirmKeysReady,
      },
      { curveParameters, maxStakeEth, ethBalance, stethBalance, wstethBalance },
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
    },
    [sdk],
  );
};
