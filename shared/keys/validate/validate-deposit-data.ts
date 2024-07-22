import { DepositData } from 'types';
import { CHAINS } from '@lido-sdk/constants';
import { checkLength } from './check-length';
import { checkDuplicates } from './check-duplicates';
import { checkPreviouslySubmittedDuplicates } from './check-previously-submitted-duplicates';
import { checkItem } from './check-item';

export const validateDepositData = (
  depositData: DepositData[],
  chainId: CHAINS,
  wc: string,
) => {
  try {
    depositData.forEach((data) => checkItem(data, chainId, wc));
    checkLength(depositData);
    checkDuplicates(depositData);
    checkPreviouslySubmittedDuplicates(depositData, chainId);
  } catch (error) {
    return error as Error;
  }
  return null;
};
