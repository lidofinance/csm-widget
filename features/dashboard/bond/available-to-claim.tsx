import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  BOND_EXCESS,
  BOND_INSUFFICIENT,
  BOND_INSUFFICIENT_HELP,
  BOND_LOCKED,
  BOND_LOCKED_HELP,
} from 'consts/text';
import {
  getNextDistribution,
  useFeeSplits,
  useFrameInfo,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorRewards,
} from 'modules/web3';
import { FC } from 'react';
import { Counter, IconTooltip } from 'shared/components';
import { calculateAvailableToClaim } from 'utils';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const AvailableToClaim: FC = () => {
  const nodeOperatorId = useNodeOperatorId();

  const { data: bond, isPending: isBondLoading } = useOperatorBalance({
    nodeOperatorId,
  });

  const { data: rewards, isPending: isRewardsLoading } = useOperatorRewards({
    nodeOperatorId,
  });

  const { data: feeSplits } = useFeeSplits({ nodeOperatorId });

  const { data: nextDistribution } = useFrameInfo(getNextDistribution);

  const availableToClaim = calculateAvailableToClaim({
    bond,
    rewards,
    feeSplits,
  });

  return (
    <AccordionStyle
      data-testid="availableToClaimBlock"
      summary={
        <RowHeader>
          <RowTitle>
            Available to claim
            {(bond?.isInsufficient || !!bond?.locked) && (
              <Counter warning count={1} />
            )}
          </RowTitle>
          <Balance
            data-testid="commonBalance"
            big
            loading={isBondLoading || isRewardsLoading}
            amount={availableToClaim}
          />
        </RowHeader>
      }
    >
      <RowBody>
        <Balance
          data-testid="rewardsBalance"
          title={
            <>
              Rewards
              <IconTooltip
                tooltip={`Next rewards distribution is expected ${nextDistribution}`}
                type="calendar"
              />
            </>
          }
          loading={isRewardsLoading}
          amount={rewards?.available}
        />
        {bond?.isInsufficient ? (
          <>
            <Balance
              warning
              sign="minus"
              title={BOND_INSUFFICIENT}
              help={BOND_INSUFFICIENT_HELP}
              loading={isBondLoading}
              amount={bond.delta}
            />
          </>
        ) : (
          <>
            <Balance
              data-testid="excessBondBalance"
              sign="plus"
              title={
                <>
                  {BOND_EXCESS}
                  <IconTooltip tooltip="Increases daily" type="calendar" />
                </>
              }
              loading={isBondLoading}
              amount={bond?.delta}
            />
          </>
        )}
        {!!bond?.locked && (
          <>
            <Balance
              warning
              sign="minus"
              title={BOND_LOCKED}
              loading={isBondLoading}
              amount={bond.locked}
              token={TOKENS.eth}
              help={BOND_LOCKED_HELP}
            />
          </>
        )}
      </RowBody>
    </AccordionStyle>
  );
};
