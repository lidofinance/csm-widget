import { DepositData } from 'types';

export const assertIsArrayOfDepositData: (
  depositData: unknown,
) => asserts depositData is DepositData[] = (depositData) => {
  if (!Array.isArray(depositData)) {
    throw new Error('it should be an array');
  }

  depositData.forEach((item) => {
    if (typeof item !== 'object') {
      throw new Error('it should be an array of a objects');
    }
  });
};
