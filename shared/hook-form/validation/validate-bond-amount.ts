import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { ValidationError } from 'shared/hook-form/validation/validation-error';
import { getTokenDisplayName } from 'utils';

type ValidateBondAmountProps = {
  token: TOKENS;
  bondAmount?: BigNumber;
  maxStakeEther?: BigNumber | null;
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
};

export const validateBondAmount = ({
  token,
  bondAmount,
  maxStakeEther,
  etherBalance,
  stethBalance,
  wstethBalance,
}: ValidateBondAmountProps) => {
  if (bondAmount?.gt(0)) {
    if (token === TOKENS.ETH && maxStakeEther?.lt(bondAmount)) {
      throw new ValidationError(
        'bondAmount',
        `Lido has reached its stake limit for ETH deposits — use another token or try later`,
      );
    }

    const balances = {
      [TOKENS.ETH]: etherBalance,
      [TOKENS.STETH]: stethBalance,
      [TOKENS.WSTETH]: wstethBalance,
    };
    const tokenBalance = balances[token];

    if (tokenBalance?.lt(bondAmount))
      throw new ValidationError(
        'bondAmount',
        `Not enought balance of ${getTokenDisplayName(token)}`,
      );
  }
};
