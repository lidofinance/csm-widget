import { useNodeOperatorId, useOperatorRewardsHistory } from 'modules/web3';
import { TablePagination, TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import { Block, Stack, WhenLoaded } from 'shared/components';
import { BondTableSwitcher } from 'shared/navigate';
import { Table } from './table';
import { sortFunctions } from './sort';
import { FiltersAndExport } from './filters-and-export';

export const RewardsHistorySection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data, isPending } = useOperatorRewardsHistory(nodeOperatorId);

  return (
    <TableProvider
      data={data}
      sort={sortFunctions}
      defaultSort={{ column: 'startTimestamp', direction: 'desc' }}
    >
      <Stack direction="column" gap="xl">
        <Block paddingLess overflowHidden>
          <BondTableSwitcher />
          <WhenLoaded
            loading={isPending}
            empty={!data?.length && 'No rewards history available'}
            morePadding
          >
            <FiltersAndExport />
            <Table />
          </WhenLoaded>
        </Block>
        <TablePagination />
      </Stack>
    </TableProvider>
  );
};
