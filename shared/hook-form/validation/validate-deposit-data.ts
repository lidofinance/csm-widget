import type { DepositData, DepositDataSDK } from '@lidofinance/lido-csm-sdk';
import { groupBy, mapValues } from 'lodash';
import { ValidationError } from './validation-error';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  sdk: DepositDataSDK;
};

export const validateDepositData = async ({
  depositData,
  sdk,
}: ValidateDepositDataProps) => {
  if (!depositData?.length) return;
  const errors = await sdk.validateDepositData(depositData);

  if (!errors?.length) return;

  const types = mapValues(groupBy(errors, 'index'), (errors) =>
    errors.map((error) => error.message),
  );

  throw new ValidationError(
    'depositData',
    'Invalid deposit data',
    undefined,
    undefined,
    types,
  );
};
