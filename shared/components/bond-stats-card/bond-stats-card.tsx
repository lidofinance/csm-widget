import {
  Card,
  DataList,
  DataListRow,
  Grid,
  IconLockKeyhole,
  Skeleton,
  Stack,
  StatItem,
  Typography,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  BOND_EXCESS,
  BOND_INSUFFICIENT,
  BOND_INSUFFICIENT_HELP,
} from 'consts/text';
import { getNextDistribution, useFrameInfo } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { NEGATIVE_FIELDS, useNegativeMetadata } from './negative-metadata';
import { UsdValue } from './usd-value';
import { useBondStats } from './use-bond-stats';

import { ReactComponent as BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';

const INFO_TEST_ID = { info: 'iconTooltip', infoContent: 'tooltipWrapper' };
const INHERIT_FONT = { font: 'inherit' };
const STATS_COLUMNS = { base: 3, mdDown: 1 };

const CardStyled = styled(Card)`
  && {
    padding: 0;
    overflow: hidden;
    align-items: stretch;
  }
`;

const BodyStyled = styled(Stack)`
  padding: 24px;
`;

type Props = {
  header?: ReactNode;
  actions?: ReactNode;
};

type AmountProps = { amount: bigint; error?: boolean; symbol?: string };

// the stat label carries the unit, so the value drops the token symbol
const Amount: FC<AmountProps> = ({ amount, error, symbol = '' }) => {
  const value = (
    <FormatToken amount={amount} token={TOKENS.steth} symbol={symbol} />
  );
  return error ? (
    <Typography as="span" color="error" style={INHERIT_FONT}>
      {value}
    </Typography>
  ) : (
    value
  );
};

export const BondStatsCard: FC<Props> = ({ header, actions }) => {
  const { bond, rewards, splittable, isPending } = useBondStats();
  const { data: nextDistribution } = useFrameInfo(getNextDistribution);
  const negativeMetadata = useNegativeMetadata();

  const loading = <Skeleton variant="text" />;
  const negative = bond ? NEGATIVE_FIELDS.filter((field) => bond[field]) : [];
  const isInsufficient = !!bond?.isInsufficient;
  const bondAmount = bond ? (isInsufficient ? -bond.delta : bond.delta) : 0n;

  return (
    <CardStyled dataTestId={{ root: 'bondStatsCard' }}>
      {header}
      <BodyStyled gap={24}>
        <Grid columns={STATS_COLUMNS} gap={24}>
          <Stack gap={16}>
            <StatItem
              label="Rewards, stETH"
              titleIcon={<RewardsIcon />}
              info={`The rewards amount available to claim, obtained from all active validators of the Node Operator. Next rewards distribution is expected ${nextDistribution}.`}
              dataTestId={{ ...INFO_TEST_ID, root: 'rewardsStat' }}
              value={
                isPending || !rewards ? (
                  loading
                ) : (
                  <Amount amount={rewards.available} />
                )
              }
              subValue={rewards && <UsdValue amount={rewards.available} />}
            />
            {splittable > 0n && (
              <DataList>
                <DataListRow
                  label="To splitters:"
                  info="Portion of rewards routed to splitters."
                  value={<Amount amount={splittable} symbol="stETH" />}
                  dataTestId={{ ...INFO_TEST_ID, root: 'toSplittersRow' }}
                />
              </DataList>
            )}
          </Stack>
          <Stack gap={16}>
            <StatItem
              label={`${isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}, stETH`}
              titleIcon={<BondIcon />}
              info={
                isInsufficient
                  ? BOND_INSUFFICIENT_HELP
                  : bond?.locked
                    ? 'Locked bond has not been burned yet but cannot be claimed, so it is not displayed as part of your Excess Bond'
                    : 'The bond amount available to claim without having to exit validators. Increases daily.'
              }
              dataTestId={{ ...INFO_TEST_ID, root: 'excessBondStat' }}
              value={
                isPending || !bond ? (
                  loading
                ) : (
                  <Amount amount={bondAmount} error={isInsufficient} />
                )
              }
              subValue={bond && <UsdValue amount={bondAmount} />}
            />
            {bond && negative.length > 0 && (
              <DataList divided>
                {negative.map((field) => (
                  <DataListRow
                    key={field}
                    label={negativeMetadata[field].title}
                    info={negativeMetadata[field].tooltip}
                    value={
                      <Amount
                        amount={bond[field]}
                        error
                        symbol={field === 'locked' ? 'ETH' : 'stETH'}
                      />
                    }
                    dataTestId={{ ...INFO_TEST_ID, root: `${field}BondRow` }}
                  />
                ))}
              </DataList>
            )}
          </Stack>
          <StatItem
            label="Required bond, stETH"
            titleIcon={<IconLockKeyhole />}
            info="The amount of bond required for all submitted keys of the Node Operator"
            dataTestId={{ ...INFO_TEST_ID, root: 'requiredBondStat' }}
            value={
              isPending || !bond ? loading : <Amount amount={bond.required} />
            }
            subValue={bond && <UsdValue amount={bond.required} />}
          />
        </Grid>
        {actions}
      </BodyStyled>
    </CardStyled>
  );
};
