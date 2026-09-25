import { BondBalance, Rewards, TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  BOND_DEBT,
  BOND_DEBT_HELP,
  BOND_EXCESS,
  BOND_INSUFFICIENT,
  BOND_INSUFFICIENT_HELP,
  BOND_LOCKED,
  BOND_LOCKED_HELP,
} from 'consts/text';
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
          help={BOND_INSUFFICIENT_HELP}
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
    {!!bond?.locked && (
      <Balance
        data-testid="lockedBondBalance"
        warning
        sign="minus"
        title={BOND_LOCKED}
        help={BOND_LOCKED_HELP}
        loading={isBondPending}
        amount={bond.locked}
        token={TOKENS.eth}
        approx
      />
    )}
    {!!bond?.debt && (
      <Balance
        data-testid="debtBalance"
        warning
        sign="minus"
        title={BOND_DEBT}
        help={BOND_DEBT_HELP}
        loading={isBondPending}
        amount={bond.debt}
        token={TOKENS.steth}
        approx
      />
    )}
  </BondRowStyle>
);
