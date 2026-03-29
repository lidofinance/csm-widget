import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Divider, Text } from '@lidofinance/lido-ui';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { useFrameInfo } from 'modules/web3';
import { FC, Fragment, ReactNode } from 'react';
import { useFormState } from 'react-hook-form';
import { Block, Grid, IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { formatDate, isDayInPast } from 'utils';
import { useClaimBondFormData } from '../context';

import { ReactComponent as BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';
import { Balance } from 'features/dashboard/bond/balance';

const NEGATIVE_FIELDS = ['pendingToSplit', 'debt', 'locked'] as const;
const BOND_NEGATIVE_METADATA: Record<
  (typeof NEGATIVE_FIELDS)[number],
  Pick<BondNegativeProps, 'title' | 'tooltip' | 'token'>
> = {
  locked: {
    title: 'Locked:',
    tooltip:
      'Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations',
    token: TOKENS.eth,
  },
  pendingToSplit: {
    title: 'Pending to split:',
    tooltip:
      '“Pending to split” is the amount that hasn’t been split due to insufficient bond or locked bond that occurred earlier. When claiming rewards CSM will try to split this amount from excess bond.',
    token: TOKENS.steth,
  },
  debt: {
    title: 'Debt:',
    token: TOKENS.steth,
  },
};

export const SourcesInfo: FC = () => {
  const { isLoading } = useFormState();
  const { bond, rewards } = useClaimBondFormData();
  const { data: nextDistribution } = useFrameInfo((data) =>
    isDayInPast(data.nextReport) ? 'soon' : `on ${formatDate(data.nextReport)}`,
  );

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
                  {...BOND_NEGATIVE_METADATA[field]}
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

type BondNegativeProps = {
  title: ReactNode;
  tooltip?: ReactNode;
  amount: bigint;
  token: TOKENS;
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
