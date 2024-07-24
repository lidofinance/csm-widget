import { CHAINS } from '@lido-sdk/constants';
import { getCsmWc } from 'consts/csm-wc';
import { validate } from 'shared/keys';
import invariant from 'tiny-invariant';
import type { DepositData } from 'types';
import { ValidationError } from './validation-error';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  chainId?: CHAINS;
};
export const validateDepositData = ({
  depositData,
  chainId,
}: ValidateDepositDataProps) => {
  const wc = getCsmWc(chainId);
  invariant(chainId);
  invariant(wc);
  const error = validate(depositData, chainId, wc);
  if (error) {
    throw new ValidationError('depositData', error.message);
  }
};
