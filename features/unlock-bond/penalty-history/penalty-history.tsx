import type { PenaltyRecord } from '@lidofinance/lido-csm-sdk';
import { Divider, Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId, useOperatorPenalties } from 'modules/web3';
import { TablePagination, TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import { Stack, WhenLoaded } from 'shared/components';
import { PenaltyHistoryTable } from './penalty-history-table';
import { sortFunctions } from './sort';
import { AccordionStyle, Wrapper } from './styles';
import { EnrichedPenalty } from './types';

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

  const { data, isPending } = useOperatorPenalties(nodeOperatorId, (data) =>
    data.map(enrichPenalty),
  );

  return (
    <AccordionStyle
      summary={
        <Text as="h4" size="sm" weight={700}>
          Penalty History
        </Text>
      }
      defaultExpanded={false}
    >
      <Divider />
      <TableProvider
        data={data}
        sort={sortFunctions}
        defaultSort={{ column: 'timestamp', direction: 'desc' }}
      >
        <WhenLoaded
          loading={isPending}
          empty={!data?.length && 'No penalty history'}
        >
          <Stack direction="column" gap="md">
            <PenaltyHistoryTable />
            <Wrapper>
              <TablePagination />
            </Wrapper>
          </Stack>
        </WhenLoaded>
      </TableProvider>
    </AccordionStyle>
  );
};
