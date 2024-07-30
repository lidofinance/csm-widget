import { DepositData } from 'types';

const MAX_DEPOSIT_DATA_LENGTH = 10; // 10 keys

export const checkLength = (signingKeys: DepositData[]) => {
  if (signingKeys.length === 0) {
    throw new Error(`Should have at least 1 key`);
  }
  if (signingKeys.length > MAX_DEPOSIT_DATA_LENGTH) {
    throw new Error(`Should have no more than ${MAX_DEPOSIT_DATA_LENGTH} keys`);
  }
};
