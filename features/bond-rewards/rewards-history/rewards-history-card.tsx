import { Card, EmptyState, Spinner, Stack } from '@lidofinance/lido-app-ui';
import { useNodeOperatorId, useOperatorRewardsHistory } from 'modules/web3';
import { TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import { RewardsHistoryHeader } from './rewards-history-header';
import { RewardsHistoryTable } from './rewards-history-table';
import { sortFunctions } from './sort';
import s from './rewards-history-card.module.css';

import RewardsIcon from 'assets/balance/rewards.svg?react';

export const RewardsHistoryCard: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data, isPending, isError } = useOperatorRewardsHistory({
    nodeOperatorId,
  });
  const hasData = !!data?.length;

  return (
    <TableProvider
      data={data}
      sort={sortFunctions}
      defaultSort={{ column: 'startTimestamp', direction: 'desc' }}
    >
      <Card
        align="stretch"
        padding={0}
        gap={0}
        clip
        dataTestId={{ root: 'rewardsHistoryCard' }}
      >
        <RewardsHistoryHeader showExport={hasData} />
        {isPending ? (
          <Stack className={s.loader} align="center" justify="center">
            <Spinner label="Loading rewards history" />
          </Stack>
        ) : hasData ? (
          <RewardsHistoryTable />
        ) : isError ? (
          <EmptyState title="Failed to load rewards history" />
        ) : (
          <EmptyState
            illustration={<RewardsIcon className={s.rewardsIcon} />}
            title="No rewards at the moment"
            description="Once your rewards are distributed, you'll be able to see them there"
            dataTestId={{ root: 'rewardsHistoryEmpty' }}
          />
        )}
      </Card>
    </TableProvider>
  );
};
