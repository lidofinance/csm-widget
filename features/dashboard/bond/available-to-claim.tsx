import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Counter, IconTooltip } from 'shared/components';
import {
  useNodeOperatorBalance,
  useNodeOperatorRewards,
  useRewardsFrame,
} from 'shared/hooks';
import { useAvailableToClaim } from 'shared/hooks/useAvailableToClaim';
import { formatDate } from 'utils';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const AvailableToClaim: FC = () => {
  const id = useNodeOperatorId();

  const { data: bond, initialLoading: isBondLoading } =
    useNodeOperatorBalance(id);

  const { data: rewards, initialLoading: isRewardsLoading } =
    useNodeOperatorRewards(id);

  const { data: rewardsFrame } = useRewardsFrame();
  const nextRewardsDate = formatDate(rewardsFrame?.nextRewards);

  const availableToClaim = useAvailableToClaim({
    bond,
    rewards,
  });

  return (
    <AccordionStyle
      data-testid="availableToClaimBlock"
      summary={
        <RowHeader>
          <RowTitle>
            Available to claim
            {(bond?.isInsufficient || bond?.locked.gt(0)) && (
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
                tooltip={`Next rewards distribution is expected on ${nextRewardsDate}`}
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
              help="Insufficient bond is the missing amount of stETH required to cover all operator’s keys"
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
        {bond?.locked.gt(0) && (
          <>
            <Balance
              warning
              sign="minus"
              title="Locked bond"
              loading={isBondLoading}
              amount={bond.locked}
              token={TOKENS.ETH}
              help="Bond is locked because of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations"
            />
          </>
        )}
      </RowBody>
    </AccordionStyle>
  );
};
