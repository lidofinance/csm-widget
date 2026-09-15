import { BondBalance, Rewards } from '@lidofinance/lido-csm-sdk';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { Balance } from 'features/dashboard/bond/balance';
import { FC } from 'react';
import { BondRowStyle } from './styles';

type Props = {
  bond: BondBalance | undefined;
  rewards: Rewards | undefined;
  availableToClaim: bigint | undefined;
  isBondPending: boolean;
  isRewardsPending: boolean;
};

export const BondRow: FC<Props> = ({
  bond,
  rewards,
  availableToClaim,
  isBondPending,
  isRewardsPending,
}) => (
  <BondRowStyle data-testid="operatorBondRow">
    {bond?.isInsufficient ? (
      <>
        <Balance
          data-testid="availableToClaimBalance"
          title="Available to claim"
          loading={isBondPending || isRewardsPending}
          amount={availableToClaim}
          approx
        />
        <Balance
          data-testid="insufficientBondBalance"
          warning
          title={BOND_INSUFFICIENT}
          help="Insufficient bond is the missing amount of stETH required to cover all operator’s keys"
          loading={isBondPending}
          amount={bond.delta}
          approx
        />
      </>
    ) : (
      <>
        <Balance
          data-testid="rewardsBalance"
          title="Rewards"
          loading={isRewardsPending}
          amount={rewards?.available}
          approx
        />
        <Balance
          data-testid="excessBondBalance"
          title={BOND_EXCESS}
          loading={isBondPending}
          amount={bond?.delta}
          approx
        />
      </>
    )}
  </BondRowStyle>
);
