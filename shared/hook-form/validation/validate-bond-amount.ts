import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { ValidationError } from 'shared/hook-form/validation/validation-error';
import { getTokenBalance, getTokenDisplayName } from 'utils';

type ValidateBondAmountProps = {
  token: TOKENS;
  bondAmount?: bigint;
  maxStakeEth?: bigint;
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
};

export const validateBondAmount = ({
  token,
  bondAmount,
  maxStakeEth,
  ethBalance,
  stethBalance,
  wstethBalance,
}: ValidateBondAmountProps) => {
  if (bondAmount && bondAmount > 0) {
    if (token === TOKENS.eth && maxStakeEth && maxStakeEth < bondAmount) {
      throw new ValidationError(
        'bondAmount',
        `Lido protocol has reached its stake limit for ETH deposits — use another token or try later`,
      );
    }

    const tokenBalance = getTokenBalance(
      {
        [TOKENS.eth]: ethBalance,
        [TOKENS.steth]: stethBalance,
        [TOKENS.wsteth]: wstethBalance,
      },
      token,
    );

    if (tokenBalance !== undefined && tokenBalance < bondAmount)
      throw new ValidationError(
        'bondAmount',
        `Not enough balance of ${getTokenDisplayName(token)}`,
      );
  }
};
