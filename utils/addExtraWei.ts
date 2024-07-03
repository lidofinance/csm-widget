import { TOKENS } from 'consts/tokens';
import { ROUNDING_TRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';

/**
 * Add 10 wei for approve/permit request
 */
export const addExtraWei = (amount?: BigNumber, token?: TOKENS) => {
  if (token !== TOKENS.ETH && amount?.gt(0)) {
    return amount.add(ROUNDING_TRESHOLD);
  }
  return amount;
};
