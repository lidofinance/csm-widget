import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Counter, IconTooltip, Sign } from 'shared/components';
import { useNodeOperatorBalance, useNodeOperatorRewards } from 'shared/hooks';
import { useAvailableToClaim } from 'shared/hooks/useAvailableToClaim';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const AvailableToClaim: FC = () => {
  const id = useNodeOperatorId();

  const { data: bond, initialLoading: isBondLoading } =
    useNodeOperatorBalance(id);

  const { data: rewards, initialLoading: isRewardsLoading } =
    useNodeOperatorRewards(id);

  const availableToClaim = useAvailableToClaim({
    bond,
    rewards,
  });

  return (
    <AccordionStyle
      summary={
        <RowHeader>
          <RowTitle>
            Available to claim
            {(bond?.isInsufficient || bond?.locked.gt(0)) && (
              <Counter warning count={1} />
            )}
          </RowTitle>
          <Balance
            big
            loading={isBondLoading || isRewardsLoading}
            amount={availableToClaim}
          />
        </RowHeader>
      }
    >
      <RowBody>
        <Balance
          title={
            <>
              Rewards
              <IconTooltip
                tooltip="Next rewards distribution is expected on 17.10.2024"
                type="calendar"
              />
            </>
          }
          loading={isRewardsLoading}
          amount={rewards?.available}
        />
        {bond?.isInsufficient ? (
          <>
            <Sign minus />
            <Balance
              warning
              title={BOND_INSUFFICIENT}
              help="Insufficient bond is the missing amount of stETH required to cover all operator’s keys."
              loading={isBondLoading}
              amount={bond.delta}
            />
          </>
        ) : (
          <>
            <Sign />
            <Balance
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
            <Sign minus />
            <Balance
              warning
              title="Locked bond"
              loading={isBondLoading}
              amount={bond.locked}
              token={TOKENS.ETH}
              help="Bond is locked because of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations."
            />
          </>
        )}
      </RowBody>
    </AccordionStyle>
  );
};
