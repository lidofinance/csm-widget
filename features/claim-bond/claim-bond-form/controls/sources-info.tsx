import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Divider, Text } from '@lidofinance/lido-ui';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { useFrameInfo } from 'modules/web3';
import { FC, Fragment, ReactNode } from 'react';
import { useFormState } from 'react-hook-form';
import { Block, Grid, IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useShowRule } from 'shared/hooks';
import styled from 'styled-components';
import { formatDate, isDayInPast } from 'utils';
import { useClaimBondFormData } from '../context';

import { ReactComponent as BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';
import { Balance } from 'features/dashboard/bond/balance';

const LOCKED_TOOLTIP_CSM =
  'Penalties have been applied to your Node Operator because of an MEV stealing event reported by a dedicated committee. If it is not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab.';

const LOCKED_TOOLTIP_CM =
  'Penalties have been applied to your Node Operator. If they are not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab.';

const NEGATIVE_FIELDS = ['pendingToSplit', 'debt', 'locked'] as const;

type BondNegativeProps = {
  title: ReactNode;
  tooltip?: ReactNode;
  amount: bigint;
  token: TOKENS;
};

const useBondNegativeMetadata = () => {
  const check = useShowRule();
  const lockedTooltip = check('IS_CSM')
    ? LOCKED_TOOLTIP_CSM
    : LOCKED_TOOLTIP_CM;

  return {
    locked: {
      title: 'Locked:',
      tooltip: lockedTooltip,
      token: TOKENS.eth,
    },
    pendingToSplit: {
      title: 'Pending to split:',
      tooltip:
        '"Pending to split" is the amount that has not been split due to insufficient bond or locked bond that occurred earlier. When claiming rewards CSM will try to split this amount from excess bond.',
      token: TOKENS.steth,
    },
    debt: {
      title: 'Debt:',
      token: TOKENS.steth,
    },
  } as Record<
    (typeof NEGATIVE_FIELDS)[number],
    Pick<BondNegativeProps, 'title' | 'tooltip' | 'token'>
  >;
};

export const SourcesInfo: FC = () => {
  const { isLoading } = useFormState();
  const { bond, rewards } = useClaimBondFormData();
  const { data: nextDistribution } = useFrameInfo((data) =>
    isDayInPast(data.nextReport) ? 'soon' : `on ${formatDate(data.nextReport)}`,
  );
  const bondNegativeMetadata = useBondNegativeMetadata();

  const negative = bond ? NEGATIVE_FIELDS.filter((field) => bond[field]) : [];

  if (isLoading || !bond || !rewards) {
    return null;
  }

  return (
    <Grid $gap="ms">
      <Block padding="none" overflowHidden>
        <ContentPadding gap="sm" center spaceBetween>
          <Balance
            title={
              <>
                Rewards balance
                <IconTooltip
                  tooltip={`The rewards amount available to claim, obtained from all active validators of the Node Operator. Next rewards distribution is expected ${nextDistribution}`}
                  type="calendar"
                />
              </>
            }
            amount={rewards.available}
            approx
          />

          <IconWrapper>
            <RewardsIcon />
          </IconWrapper>
        </ContentPadding>
      </Block>
      <Block padding="none" overflowHidden>
        <ContentPadding gap="sm" center spaceBetween>
          <Balance
            title={
              <>
                {bond.isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}
                <IconTooltip
                  type={bond.isInsufficient ? 'info' : 'calendar'}
                  tooltip={
                    bond.isInsufficient
                      ? "Insufficient bond is the missing amount of stETH required to cover all operator's keys"
                      : bond.locked > 0n
                        ? 'Locked bond has not been burned yet but cannot be claimed, so it is not displayed as part of your Excess Bond.'
                        : 'The bond amount available to claim without having to exit validators. Increases daily'
                  }
                />
              </>
            }
            amount={bond.isInsufficient ? -bond.delta : bond.delta}
            warning={bond.isInsufficient}
            approx
          />

          <IconWrapper>
            <BondIcon />
          </IconWrapper>
        </ContentPadding>

        {negative.length > 0 && (
          <FooterStyle>
            {negative.map((field, index) => (
              <Fragment key={field}>
                {index > 0 && <Divider />}
                <BondNegative
                  {...bondNegativeMetadata[field]}
                  amount={bond[field]}
                />
              </Fragment>
            ))}
          </FooterStyle>
        )}
      </Block>
    </Grid>
  );
};

const BondNegative: FC<BondNegativeProps> = ({
  title,
  tooltip,
  amount,
  token,
}) => (
  <Stack gap="xs" center>
    <Text size="xxs" weight={700}>
      {title}
    </Text>
    <Text size="xxs" weight={700}>
      <FormatToken amount={amount} token={token} />
    </Text>
    <IconTooltip tooltip={tooltip} />
  </Stack>
);

const ContentPadding = styled(Stack)`
  padding: ${({ theme }) => theme.spaceMap.md}px
    ${({ theme }) => theme.spaceMap.xxl}px;
`;

const FooterStyle = styled.div`
  background: var(--lido-color-border);
  margin-top: -${({ theme }) => theme.spaceMap.xs}px;
  padding: ${({ theme }) => theme.spaceMap.sm}px
    ${({ theme }) => theme.spaceMap.xxl}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

const IconWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
`;
