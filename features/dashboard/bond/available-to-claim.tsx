import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import {
  useFrameInfo,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorRewards,
} from 'modules/web3';
import { FC } from 'react';
import { Counter, IconTooltip } from 'shared/components';
import { useAvailableToClaim } from 'shared/hooks';
import { formatDate } from 'utils';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const AvailableToClaim: FC = () => {
  const id = useNodeOperatorId();

  const { data: bond, isPending: isBondLoading } = useOperatorBalance(id);

  const { data: rewards, isPending: isRewardsLoading } = useOperatorRewards(id);

  const { data: nextDistribution } = useFrameInfo(
    (data) => data.lastReport + data.frameDuration,
  );
  const nextRewardsDate = formatDate(nextDistribution);

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
            {(bond?.isInsufficient || !!bond?.locked) && (
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
              title="Locked bond"
              loading={isBondLoading}
              amount={bond.locked}
              token={TOKENS.eth}
              help="Bond is locked because of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations"
            />
          </>
        )}
      </RowBody>
    </AccordionStyle>
  );
};
