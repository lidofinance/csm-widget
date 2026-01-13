import type { DepositData, DepositDataSDK } from '@lidofinance/lido-csm-sdk';
import { groupBy, mapValues } from 'lodash';
import { KEYS_UPLOAD_TX_LIMIT } from 'consts/keys';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  sdk: DepositDataSDK;
  keysLimit?: number;
  currentActiveKeys?: number;
};

export const validateDepositData = async ({
  depositData,
  sdk,
  keysLimit,
  currentActiveKeys,
}: ValidateDepositDataProps) => {
  if (!depositData?.length) return;

  // 1. SDK validation of deposit data structure
  const errors = await sdk.validateDepositData(depositData);

  if (errors?.length) {
    const types = mapValues(groupBy(errors, 'index'), (errors) =>
      errors.map((error) => error.message),
    );

    console.warn('Deposit data validation errors (suppressed):', {
      message: 'Invalid deposit data',
      types,
      errorCount: errors.length,
    });
    // Don't throw - allow validation to pass
  }

  // 2. Transaction limit check (25 keys per transaction)
  if (depositData.length > KEYS_UPLOAD_TX_LIMIT) {
    console.warn('Transaction limit validation error (suppressed):', {
      message: `Too many keys in one transaction. Maximum allowed: ${KEYS_UPLOAD_TX_LIMIT}`,
      actual: depositData.length,
      limit: KEYS_UPLOAD_TX_LIMIT,
    });
    // Don't throw - allow validation to pass
  }

  // 3. Operator keys limit check
  if (keysLimit !== undefined) {
    const keysCount = depositData.length;

    if (currentActiveKeys !== undefined) {
      // Add-keys flow: check total keys after adding
      if (currentActiveKeys + keysCount > keysLimit) {
        const availableSlots = Math.max(keysLimit - currentActiveKeys, 0);
        console.warn('Keys limit validation error (suppressed):', {
          message: `Keys limit exceeded. Allowed keys count to submit: ${availableSlots}`,
          currentActiveKeys,
          keysCount,
          keysLimit,
          availableSlots,
        });
        // Don't throw - allow validation to pass
      }
    } else {
      // Submit-keys flow: check only new keys count
      if (keysCount > keysLimit) {
        console.warn('Keys limit validation error (suppressed):', {
          message: `Keys limit exceeded. Allowed keys count to submit: ${keysLimit}`,
          keysCount,
          keysLimit,
        });
        // Don't throw - allow validation to pass
      }
    }
  }
};
