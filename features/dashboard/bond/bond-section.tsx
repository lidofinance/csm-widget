import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TOKENS } from 'consts/tokens';
import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Counter, SectionBlock, Sign, Stack } from 'shared/components';
import { useNodeOperatorBalance, useNodeOperatorRewards } from 'shared/hooks';
import { useAvailableToClaim } from 'shared/hooks/useAvailableToClaim';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';

export const BondSection: FC = () => {
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
    <SectionBlock
      title="Bond & Rewards"
      href={PATH.BOND}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardBondLink}
    >
      {bond && (
        <Stack direction="column" gap="md">
          <AccordionStyle
            summary={
              <RowHeader>
                <RowTitle>
                  Available to claim
                  {(bond.isNoticiableInsufficient || bond.locked.gt(0)) && (
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
                title="Rewards"
                loading={isRewardsLoading}
                amount={rewards?.available}
              />
              {bond.isInsufficient ? (
                <>
                  <Sign minus />
                  <Balance
                    dangerous={bond.isNoticiableInsufficient}
                    title={BOND_INSUFFICIENT}
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              ) : (
                <>
                  <Sign />
                  <Balance
                    title={BOND_EXCESS}
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              )}
              {bond.locked.gt(0) && (
                <>
                  <Sign minus />
                  <Balance
                    dangerous
                    title="Locked bond"
                    loading={isBondLoading}
                    amount={bond.locked}
                    token={TOKENS.ETH}
                  />
                </>
              )}
            </RowBody>
          </AccordionStyle>
          <AccordionStyle
            summary={
              <RowHeader>
                <RowTitle>
                  Bond balance
                  {bond.isNoticiableInsufficient && (
                    <Counter warning count={1} />
                  )}
                </RowTitle>
                <Balance
                  big
                  loading={isBondLoading}
                  amount={bond.current}
                  token={TOKENS.STETH}
                />
              </RowHeader>
            }
          >
            <RowBody>
              <Balance
                title="Required bond"
                loading={isBondLoading}
                amount={bond.required}
              />

              {bond.isInsufficient ? (
                <>
                  <Sign minus />
                  <Balance
                    dangerous={bond.isNoticiableInsufficient}
                    title={BOND_INSUFFICIENT}
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              ) : (
                <>
                  <Sign />
                  <Balance
                    title={BOND_EXCESS}
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              )}
            </RowBody>
          </AccordionStyle>
        </Stack>
      )}
    </SectionBlock>
  );
};
