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

  const { data: balance, initialLoading: isLoading } =
    useNodeOperatorBalance(id);

  const {
    data: { available: rewards },
    initialLoading: isRewardsLoading,
  } = useNodeOperatorRewards(id);

  const { data: locked, initialLoading: isLockedLoading } =
    useNodeOperatorLockAmount(id);

  const availableToClaim = useAvailableToClaim({ balance, rewards, locked });

  return (
    <SectionBlock title="Bond & Rewards" href={BOND_PATH}>
      {balance && (
        <Stack direction="column" gap="md">
          <AccordionStyle
            summary={
              <RowHeader>
                <RowTitle>Available to claim</RowTitle>
                <Balance
                  big
                  loading={isLoading || isRewardsLoading}
                  amount={availableToClaim}
                />
              </RowHeader>
            }
          >
            <RowBody>
              <Balance
                title="Rewards"
                loading={isRewardsLoading}
                amount={rewards}
              />
              {balance.isShortage ? (
                <>
                  <Sign minus />
                  <Balance
                    dangerous={balance.isNoticiableShortage}
                    title="Shortage bond"
                    loading={isLoading}
                    amount={balance.shortage}
                  />
                </>
              ) : (
                <>
                  <Sign />
                  <Balance
                    title="Excess bond"
                    loading={isLoading}
                    amount={balance.excess}
                  />
                </>
              )}
              {locked?.gt(0) && (
                <>
                  <Sign minus />
                  <Balance
                    dangerous
                    title="Locked bond"
                    loading={isLockedLoading}
                    amount={locked}
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
                  loading={isLoading}
                  amount={balance.current}
                  token={TOKENS.STETH}
                />
              </RowHeader>
            }
          >
            <RowBody>
              <Balance
                title="Required bond"
                loading={isLoading}
                amount={balance.required}
              />

              {balance.isShortage ? (
                <>
                  <Sign minus />
                  <Balance
                    dangerous={balance.isNoticiableShortage}
                    title="Shortage bond"
                    loading={isLoading}
                    amount={balance.shortage}
                  />
                </>
              ) : (
                <>
                  <Sign />
                  <Balance
                    title="Excess bond"
                    loading={isLoading}
                    amount={balance.excess}
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
