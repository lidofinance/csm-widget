import { Card, EmptyState, Spinner, Stack } from '@lidofinance/lido-app-ui';
import { useNodeOperatorId, useOperatorRewardsHistory } from 'modules/web3';
import { TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import styled from 'styled-components';
import { RewardsHistoryHeader } from './rewards-history-header';
import { RewardsHistoryTable } from './rewards-history-table';
import { sortFunctions } from './sort';

import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';

const CardStyled = styled(Card)`
  && {
    padding: 0;
    overflow: hidden;
    align-items: stretch;
  }
`;

const RewardsIconStyled = styled(RewardsIcon)`
  width: 48px;
  height: 48px;
  color: var(--lido-app-ui-color-text-secondary);
`;

const LoaderStyled = styled(Stack)`
  min-height: 200px;
`;

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
      <CardStyled dataTestId={{ root: 'rewardsHistoryCard' }}>
        <RewardsHistoryHeader showExport={hasData} />
        {isPending ? (
          <LoaderStyled align="center" justify="center">
            <Spinner label="Loading rewards history" />
          </LoaderStyled>
        ) : isError ? (
          <EmptyState title="Failed to load rewards history" />
        ) : hasData ? (
          <RewardsHistoryTable />
        ) : (
          <EmptyState
            illustration={<RewardsIconStyled />}
            title="No rewards at the moment"
            description="Once your rewards are distributed, you'll be able to see them there"
            dataTestId={{ root: 'rewardsHistoryEmpty' }}
          />
        )}
      </CardStyled>
    </TableProvider>
  );
};
