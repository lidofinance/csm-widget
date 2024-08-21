import { DepositData } from 'types';

export const ensureIsArray: (depositData: unknown) => DepositData[] = (
  value,
) => {
  const depositData = Array.isArray(value) ? value : [value];

  depositData.forEach((item) => {
    if (typeof item !== 'object') {
      throw new Error('it should be an array of a objects');
    }
  });

  return depositData;
};
