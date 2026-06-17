import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { VALIDATION_MESSAGES, validationMessage } from './messages';
import { ValidationError } from './validation-error';
import { getTokenBalance, getTokenDisplayName } from 'utils';

type ValidateBondAmountProps = {
  token: TOKENS;
  bondAmount?: bigint;
  maxStakeEth: bigint;
  ethBalance: bigint;
  stethBalance: bigint;
  wstethBalance: bigint;
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
    if (token === TOKENS.eth && maxStakeEth < bondAmount) {
      throw new ValidationError(
        'bondAmount',
        VALIDATION_MESSAGES.stakeLimitEthDeposits,
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

    if (tokenBalance !== undefined && tokenBalance < bondAmount) {
      throw new ValidationError(
        'bondAmount',
        validationMessage.notEnoughBalance(getTokenDisplayName(token)),
      );
    }
  }
};
