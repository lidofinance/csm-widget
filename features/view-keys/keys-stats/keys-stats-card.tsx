import { Grid, Skeleton, StatItem } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useBondByKeysCount } from 'modules/web3';
import { FC } from 'react';
import { StatsCardShell } from 'shared/components/stats-card';
import { FormatToken } from 'shared/formatters';
import { KeysActions } from './keys-actions';
import { useKeysStats } from './use-keys-stats';

const INFO_TEST_ID = { info: 'iconTooltip', infoContent: 'tooltipWrapper' };
const STATS_COLUMNS = { base: 3, mdDown: 1 };

type EthLineProps = { label: string; amount: bigint | undefined };

const EthLine: FC<EthLineProps> = ({ label, amount }) => (
  <>
    {label}:{' '}
    <FormatToken
      amount={amount ?? 0n}
      token={TOKENS.eth}
      symbol="ETH"
      trimTrailingZeros
    />
  </>
);

type BondLineProps = { amount: bigint | undefined; keysCount: number };

const BondLine: FC<BondLineProps> = ({ amount, keysCount }) =>
  amount !== undefined || keysCount === 0 ? (
    <EthLine label="Bond" amount={amount} />
  ) : (
    <Skeleton variant="text" />
  );

export const KeysStatsCard: FC = () => {
  const { stats, curve, showKeyBalance, isPending } = useKeysStats();
  const { data: activeBond } = useBondByKeysCount({
    curve,
    keysCount: stats?.activeKeys,
    token: TOKENS.eth,
  });
  const { data: totalBond } = useBondByKeysCount({
    curve,
    keysCount: stats?.totalKeys,
    token: TOKENS.eth,
  });

  const loading = <Skeleton variant="text" />;
  const ready = !isPending && !!stats;

  return (
    <StatsCardShell
      actions={<KeysActions />}
      dataTestId="keysStatsCard"
      compactOnMobile
    >
      <Grid columns={STATS_COLUMNS} gap={24}>
        <StatItem
          align="left"
          label="Active keys"
          info="Keys that are active on the Beacon Chain"
          dataTestId={{ ...INFO_TEST_ID, root: 'activeKeysStat' }}
          value={ready ? stats.activeKeys : loading}
          subValue={
            ready && (
              <BondLine amount={activeBond} keysCount={stats.activeKeys} />
            )
          }
          description={
            ready &&
            showKeyBalance && (
              <EthLine label="Key balance" amount={stats.activeBalance} />
            )
          }
        />
        <StatItem
          align="left"
          label="Total keys"
          info="All non-withdrawn keys of the Node Operator"
          dataTestId={{ ...INFO_TEST_ID, root: 'totalKeysStat' }}
          value={ready ? stats.totalKeys : loading}
          subValue={
            ready && <BondLine amount={totalBond} keysCount={stats.totalKeys} />
          }
        />
        <StatItem
          align="left"
          label="Keys limit"
          info="A maximum number of non-withdrawn keys a Node Operator can upload"
          dataTestId={{ ...INFO_TEST_ID, root: 'keysLimitStat' }}
          value={ready ? (stats.keysLimit ?? '—') : loading}
        />
      </Grid>
    </StatsCardShell>
  );
};
