import { useFeatureFlags } from 'config/feature-flags';
import {
  DISABLE_DEPOSIT_DATA_SIGNATURE_VALIDATION,
  DISABLE_DEPOSIT_DATA_VALIDATION,
} from 'config/feature-flags/types';
import { validateDkgBatch } from 'features/idvtc/dkg/utils/validate-dkg-batch';
import { useSmSDK } from 'modules/web3';
import {
  useFormValidation,
  validateBondAmount,
  validateDepositData,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import invariant from 'tiny-invariant';
import { isAddress } from 'viem';
import { useSubmitKeysFormData } from './submit-keys-data-provider';
import type {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from './types';

export const useSubmitKeysValidation = () => {
  const { targetModule } = useSubmitKeysFormData();
  const targetSdk = useSmSDK(targetModule);
  const sdk = targetSdk?.depositData;
  const featureFlags = useFeatureFlags();

  return useFormValidation<SubmitKeysFormInputType, SubmitKeysFormNetworkData>(
    'token',
    async (
      {
        token,
        bondAmount,
        depositData,
        rawDepositData,
        dkgFiles,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        confirmKeysReady,
      },
      { curveParameters, maxStakeEth, ethBalance, stethBalance, wstethBalance },
      validate,
    ) => {
      invariant(sdk, 'submit-keys validation: no SDK for the target module');

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
        if (!featureFlags?.[DISABLE_DEPOSIT_DATA_VALIDATION]) {
          await validateDepositData({
            depositData,
            sdk,
            keysLimit: curveParameters?.keysLimit,
            skipSignature:
              featureFlags?.[DISABLE_DEPOSIT_DATA_SIGNATURE_VALIDATION],
          });
        }
      });

      await validate('dkgFiles', () => {
        const error = validateDkgBatch(dkgFiles ?? []);
        if (error) throw new ValidationError('dkgFiles', error);
      });

      await validate('confirmKeysReady', () => {
        if (!confirmKeysReady) {
          throw new ValidationError(
            'confirmKeysReady',
            VALIDATION_MESSAGES.confirmKeysReady,
          );
        }
      });

      await validate('rewardsAddress', () => {
        if (specifyCustomAddresses && !isAddress(rewardsAddress ?? '')) {
          throw new ValidationError(
            'rewardsAddress',
            VALIDATION_MESSAGES.specifyValidRewardsAddress,
          );
        }
      });

      await validate('managerAddress', () => {
        if (specifyCustomAddresses && !isAddress(managerAddress ?? '')) {
          throw new ValidationError(
            'managerAddress',
            VALIDATION_MESSAGES.specifyValidManagerAddress,
          );
        }
      });
    },
    [sdk],
  );
};
