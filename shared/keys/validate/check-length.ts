import { DepositData } from 'types';

export const checkLength = (
  signingKeys: DepositData[],
  keysUploadLimit: number,
) => {
  if (signingKeys.length === 0) {
    throw new Error(`Should have at least 1 key`);
  }
  if (signingKeys.length > keysUploadLimit) {
    throw new Error(`Should have no more than ${keysUploadLimit} keys`);
  }
};
