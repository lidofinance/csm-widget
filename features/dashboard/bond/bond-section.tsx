import { TOKENS } from 'consts/tokens';
import { BOND_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Sign, Stack } from 'shared/components';
import {
  useNodeOperatorBalance,
  useNodeOperatorLockAmount,
  useNodeOperatorRewards,
} from 'shared/hooks';
import { useAvailableToClaim } from 'shared/hooks/useAvailableToClaim';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const BondSection: FC = () => {
  const id = useNodeOperatorId();

  const { data: bond, initialLoading: isBondLoading } =
    useNodeOperatorBalance(id);

  const { data: rewards, initialLoading: isRewardsLoading } =
    useNodeOperatorRewards(id);

  const { data: lockedBond, initialLoading: isLockedLoading } =
    useNodeOperatorLockAmount(id);

  const availableToClaim = useAvailableToClaim({
    bond,
    rewards,
    lockedBond,
  });

  return (
    <SectionBlock title="Bond & Rewards" href={BOND_PATH}>
      {bond && (
        <Stack direction="column" gap="md">
          <AccordionStyle
            summary={
              <RowHeader>
                <RowTitle>Available to claim</RowTitle>
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
              {bond.isShortage ? (
                <>
                  <Sign minus />
                  <Balance
                    dangerous={bond.isNoticiableShortage}
                    title="Shortage bond"
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              ) : (
                <>
                  <Sign />
                  <Balance
                    title="Excess bond"
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              )}
              {lockedBond?.gt(0) && (
                <>
                  <Sign minus />
                  <Balance
                    dangerous
                    title="Locked bond"
                    loading={isLockedLoading}
                    amount={lockedBond}
                    token={TOKENS.ETH}
                  />
                </>
              )}
            </RowBody>
          </AccordionStyle>
          <AccordionStyle
            summary={
              <RowHeader>
                <RowTitle>Bond balance</RowTitle>
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

              {bond.isShortage ? (
                <>
                  <Sign minus />
                  <Balance
                    dangerous={bond.isNoticiableShortage}
                    title="Shortage bond"
                    loading={isBondLoading}
                    amount={bond.delta}
                  />
                </>
              ) : (
                <>
                  <Sign />
                  <Balance
                    title="Excess bond"
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
