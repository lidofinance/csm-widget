import {
  Card,
  DataList,
  DataListRow,
  Grid,
  Stack,
  StatItem,
  Typography,
} from '@lidofinance/lido-app-ui';
import { PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_DEBT_HELP, BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { getNextDistribution, useFrameInfo } from 'modules/web3';
import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd, useModuleMeta, useShowRule } from 'shared/hooks';
import { useClaimBondFormData } from '../context';

import BondIcon from 'assets/balance/bond.svg?react';
import RewardsIcon from 'assets/balance/rewards.svg?react';

const INFO_TEST_ID = { info: 'iconTooltip', infoContent: 'tooltipWrapper' };
const INHERIT_FONT = { font: 'inherit' };
const STATS_COLUMNS = { base: 2, mdDown: 1 };

const LOCKED_TOOLTIP_CSM =
  'Penalties have been applied to your Node Operator because of an MEV stealing event reported by a dedicated committee. If it is not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab.';

const LOCKED_TOOLTIP_CM =
  'Penalties have been applied to your Node Operator. If they are not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab.';

const NEGATIVE_FIELDS = ['pendingToSplit', 'debt', 'locked'] as const;

type NegativeField = (typeof NEGATIVE_FIELDS)[number];

const useNegativeMetadata = (): Record<
  NegativeField,
  { title: string; tooltip: string }
> => {
  const check = useShowRule();
  const meta = useModuleMeta();

  return {
    locked: {
      title: 'Locked:',
      tooltip: check('IS_CSM_FAMILY') ? LOCKED_TOOLTIP_CSM : LOCKED_TOOLTIP_CM,
    },
    pendingToSplit: {
      title: 'Splitter debt:',
      tooltip: `Is the amount that has not been split due to insufficient bond or locked bond that occurred earlier. When claiming rewards ${meta?.shortName ?? 'the module'} will try to split this amount from excess bond.`,
    },
    debt: { title: 'Debt:', tooltip: BOND_DEBT_HELP },
  };
};

const UsdValue: FC<{ amount: bigint }> = ({ amount }) => {
  const { usdAmount } = useEthUsd(amount);
  return <FormatPrice amount={usdAmount} approx />;
};

const NegativeRow: FC<{
  title: string;
  tooltip: string;
  amount: bigint;
  testId?: string;
}> = ({ title, tooltip, amount, testId }) => (
  <DataListRow
    label={title}
    info={tooltip}
    value={<FormatToken amount={amount} token={TOKENS.steth} />}
    dataTestId={{ ...INFO_TEST_ID, root: testId }}
  />
);

export const SourcesInfo: FC = () => {
  const { isLoading } = useFormState();
  const { bond, rewards, calculation } = useClaimBondFormData();
  const { data: nextDistribution } = useFrameInfo(getNextDistribution);
  const negativeMetadata = useNegativeMetadata();

  if (isLoading || !bond || !rewards) return null;

  const negative = NEGATIVE_FIELDS.filter((field) => bond[field]);
  const splittable =
    (rewards.available * (calculation?.totalShare ?? 0n)) / PERCENT_BASIS;
  const bondAmount = bond.isInsufficient ? -bond.delta : bond.delta;

  return (
    <Grid columns={STATS_COLUMNS} gap={16}>
      <Card dataTestId={{ root: 'rewardsBalanceCard' }}>
        <Stack gap={16}>
          <StatItem
            label="Rewards balance"
            info={`The rewards amount available to claim, obtained from all active validators of the Node Operator. Next rewards distribution is expected ${nextDistribution}.`}
            dataTestId={INFO_TEST_ID}
            value={
              <FormatToken amount={rewards.available} token={TOKENS.steth} />
            }
            subValue={<UsdValue amount={rewards.available} />}
            icon={<RewardsIcon />}
          />
          {splittable > 0n && (
            <DataList>
              <NegativeRow
                title="To splitters:"
                tooltip="Portion of rewards routed to splitters. See the Splitters section for exact proportions."
                amount={splittable}
              />
            </DataList>
          )}
        </Stack>
      </Card>
      <Card dataTestId={{ root: 'bondBalanceCard' }}>
        <Stack gap={16}>
          <StatItem
            label={bond.isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}
            info={
              bond.isInsufficient
                ? "Insufficient bond is the missing amount of stETH required to cover all operator's keys"
                : bond.locked > 0n
                  ? 'Locked bond has not been burned yet but cannot be claimed, so it is not displayed as part of your Excess Bond'
                  : 'The bond amount available to claim without having to exit validators. Increases daily.'
            }
            dataTestId={INFO_TEST_ID}
            value={
              bond.isInsufficient ? (
                <Typography as="span" color="error" style={INHERIT_FONT}>
                  <FormatToken amount={bondAmount} token={TOKENS.steth} />
                </Typography>
              ) : (
                <FormatToken amount={bondAmount} token={TOKENS.steth} />
              )
            }
            subValue={<UsdValue amount={bondAmount} />}
            icon={<BondIcon />}
          />
          {negative.length > 0 && (
            <DataList divided>
              {negative.map((field) => (
                <NegativeRow
                  key={field}
                  {...negativeMetadata[field]}
                  amount={bond[field]}
                  testId={`${field}BondRow`}
                />
              ))}
            </DataList>
          )}
        </Stack>
      </Card>
    </Grid>
  );
};
