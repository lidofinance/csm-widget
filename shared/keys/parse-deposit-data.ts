import { CHAINS } from '@lido-sdk/constants';
import { DepositData } from 'types';
import { assertIsArrayOfDepositData } from './assert-is-array-of-deposit-data';
import { checkDuplicates } from './check-duplicates';
import { checkLength } from './check-length';
import { normalizeHexInJson } from './utils';

const MAX_JSON_LENGTH = 1048576; // 1MB

const parseJson = (data: string) => {
  if (!data) {
    throw new Error('deposit data should not be empty');
  }
  if (data.length > MAX_JSON_LENGTH) {
    throw new Error('deposit data is too big (max 1MB)');
  }
  try {
    const parsed = data ? JSON.parse(data) : undefined;
    return parsed;
  } catch {
    throw new Error('invalid json format');
  }
};

export const parseDepositData = (
  rawDepositData: string,
  chainId?: CHAINS,
  wc?: string,
): { error: null | Error; depositData: DepositData[] } => {
  try {
    const parsed = parseJson(normalizeHexInJson(rawDepositData));
    assertIsArrayOfDepositData(parsed, chainId, wc);
    checkLength(parsed);
    checkDuplicates(parsed);

    return { error: null, depositData: parsed };
  } catch (error) {
    return { error: error as Error, depositData: [] };
  }
};
