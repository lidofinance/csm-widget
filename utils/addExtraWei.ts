import { TOKENS } from 'consts/tokens';
import { ROUNDING_TRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';

/**
 * Add 10 wei for approve/permit request
 * for stETH only
 * on uploading deposit data and on topup bond
 */
export const addExtraWei = <T extends BigNumber | undefined>(
  amount: T,
  token: TOKENS,
) => {
  if (token === TOKENS.STETH && amount?.gt(0)) {
    return amount.add(ROUNDING_TRESHOLD);
  }
  return amount;
};
