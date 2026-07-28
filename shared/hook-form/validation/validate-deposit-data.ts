import type { DepositData, DepositDataSDK } from '@lidofinance/lido-csm-sdk';
import { groupBy, mapValues, uniqBy } from 'lodash';
import { KEYS_UPLOAD_TX_LIMIT } from 'consts/keys';
import { VALIDATION_MESSAGES, validationMessage } from './messages';
import { ValidationError } from './validation-error';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  sdk: DepositDataSDK;
  keysLimit?: number;
  nonWithdrawnKeys?: number;
  skipSignature?: boolean;
};

export const validateDepositData = async ({
  depositData,
  sdk,
  keysLimit,
  nonWithdrawnKeys,
  skipSignature,
}: ValidateDepositDataProps) => {
  if (!depositData?.length) return;

  const exceedsTxLimit = depositData.length > KEYS_UPLOAD_TX_LIMIT;

  // 1. SDK validation of deposit data structure.
  // Keys beyond the tx limit are not sent to the SDK — signature checks are
  // expensive and the submission is rejected anyway; they get a per-row error.
  const errors = await sdk.validateDepositData(
    exceedsTxLimit ? depositData.slice(0, KEYS_UPLOAD_TX_LIMIT) : depositData,
    { skipSignature },
  );

  if (errors?.length || exceedsTxLimit) {
    const types: Record<string, string[]> = mapValues(
      groupBy(errors, 'index'),
      (errors) => {
        const withField = errors.filter((e) => e.field);
        const withoutField = errors.filter((e) => !e.field);
        const uniqueWithField = uniqBy(withField, 'field');
        return [...uniqueWithField, ...withoutField].map(
          (error) => error.message,
        );
      },
    );

    for (
      let index = KEYS_UPLOAD_TX_LIMIT;
      index < depositData.length;
      index++
    ) {
      types[index] = [VALIDATION_MESSAGES.keyExceedsTxLimit];
    }

    throw new ValidationError(
      'depositData',
      exceedsTxLimit
        ? validationMessage.tooManyKeys(KEYS_UPLOAD_TX_LIMIT)
        : VALIDATION_MESSAGES.invalidDepositData,
      undefined,
      undefined,
      types,
    );
  }

  // 2. Operator keys limit check
  if (keysLimit !== undefined) {
    const keysCount = depositData.length;

    if (nonWithdrawnKeys !== undefined) {
      // Add-keys flow: check total non-withdrawn keys after adding
      if (nonWithdrawnKeys + keysCount > keysLimit) {
        const availableSlots = Math.max(keysLimit - nonWithdrawnKeys, 0);
        throw new ValidationError(
          'depositData',
          availableSlots === 0
            ? validationMessage.addKeysLimitReached(keysLimit)
            : validationMessage.addKeysLimitExceeded(keysLimit, availableSlots),
        );
      }
    } else {
      // Submit-keys flow: check only new keys count
      if (keysCount > keysLimit) {
        throw new ValidationError(
          'depositData',
          validationMessage.submitKeysLimitExceeded(keysLimit),
        );
      }
    }
  }
};
