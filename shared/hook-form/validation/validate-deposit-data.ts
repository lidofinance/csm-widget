import type { DepositData, DepositDataSDK } from '@lidofinance/lido-csm-sdk';
import { groupBy, mapValues, uniqBy } from 'lodash';
import { KEYS_UPLOAD_TX_LIMIT } from 'consts/keys';
import { pluralKeys } from 'utils';
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

  // 1. SDK validation of deposit data structure
  const errors = await sdk.validateDepositData(depositData, { skipSignature });

  if (errors?.length) {
    const types = mapValues(groupBy(errors, 'index'), (errors) => {
      const withField = errors.filter((e) => e.field);
      const withoutField = errors.filter((e) => !e.field);
      const uniqueWithField = uniqBy(withField, 'field');
      return [...uniqueWithField, ...withoutField].map(
        (error) => error.message,
      );
    });

    throw new ValidationError(
      'depositData',
      'Invalid deposit data',
      undefined,
      undefined,
      types,
    );
  }

  // 2. Transaction limit check (25 keys per transaction)
  if (depositData.length > KEYS_UPLOAD_TX_LIMIT) {
    throw new ValidationError(
      'depositData',
      `Too many keys in one transaction. Maximum allowed: ${KEYS_UPLOAD_TX_LIMIT}.`,
    );
  }

  // 3. Operator keys limit check
  if (keysLimit !== undefined) {
    const keysCount = depositData.length;

    if (nonWithdrawnKeys !== undefined) {
      // Add-keys flow: check total non-withdrawn keys after adding
      if (nonWithdrawnKeys + keysCount > keysLimit) {
        const availableSlots = Math.max(keysLimit - nonWithdrawnKeys, 0);
        throw new ValidationError(
          'depositData',
          availableSlots === 0
            ? `Keys limit of ${keysLimit} non-withdrawn ${pluralKeys({ value: keysLimit })} reached. New keys can't be uploaded.`
            : `Keys limit of ${keysLimit} non-withdrawn ${pluralKeys({ value: keysLimit })} exceeded. Only ${availableSlots} more ${pluralKeys({ value: availableSlots })} can be uploaded.`,
        );
      }
    } else {
      // Submit-keys flow: check only new keys count
      if (keysCount > keysLimit) {
        throw new ValidationError(
          'depositData',
          `Keys limit exceeded. Up to ${pluralKeys({ value: keysLimit, showValue: true })} can be uploaded.`,
        );
      }
    }
  }
};
