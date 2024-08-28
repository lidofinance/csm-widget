import { DepositData } from 'types';
import { normalizeHexInJson } from '../utils';
import { ensureIsArray } from './ensure-is-array';

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
): { error: null | Error; depositData: DepositData[] } => {
  try {
    const parsed = parseJson(normalizeHexInJson(rawDepositData));
    const depositData = ensureIsArray(parsed);

    return { error: null, depositData };
  } catch (error) {
    return { error: error as Error, depositData: [] };
  }
};
