import type { PenaltyRecord } from '@lidofinance/lido-csm-sdk';
import { Accordion, Card, Stack } from '@lidofinance/lido-app-ui';
import { useNodeOperatorId, useOperatorPenalties } from 'modules/web3';
import { TablePagination, TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import styled from 'styled-components';
import { WhenLoaded } from 'shared/components';
import { PenaltyHistoryTable } from './penalty-history-table';
import { sortFunctions } from './sort';
import { EnrichedPenalty } from './types';

const CardStyled = styled(Card)`
  && {
    padding: 0 24px;
    gap: 0;
  }

  button[aria-expanded] {
    padding: 22px 0;
  }
`;

const getPenaltyTypeLabel = (record: PenaltyRecord): string => {
  if (record.type === 'compensated') return 'Compensation';
  if (record.type === 'cancelled') return 'Cancelled';
  if (record.type === 'settled') return 'Settled';
  if (record.type === 'expired') return 'Expired';
  if (!record.penaltyType) return 'EL Stealing Penalty';
  // return record.penaltyType || 'Penalty';
  return 'Penalty';
};

const enrichPenalty = (record: PenaltyRecord): EnrichedPenalty => ({
  ...record,
  typeLabel: getPenaltyTypeLabel(record),
});

export const PenaltyHistory: FC = () => {
  const nodeOperatorId = useNodeOperatorId();

  const { data, isPending } = useOperatorPenalties({
    nodeOperatorId,
    select: (data) => data.map(enrichPenalty),
  });

  return (
    <CardStyled>
      <Accordion
        title="History"
        border={false}
        defaultExpanded={false}
        dataTestId={{ root: 'penaltyHistory' }}
      >
        <TableProvider
          data={data}
          sort={sortFunctions}
          defaultSort={{ column: 'timestamp', direction: 'desc' }}
        >
          <WhenLoaded
            loading={isPending}
            empty={!data?.length && 'No penalty history'}
          >
            <Stack gap={16}>
              <PenaltyHistoryTable />
              <TablePagination />
            </Stack>
          </WhenLoaded>
        </TableProvider>
      </Accordion>
    </CardStyled>
  );
};
