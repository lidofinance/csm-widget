import { useOperatorsWithLockedBond } from 'modules/web3';
import { TablePagination, TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import { Block, Stack, WhenLoaded } from 'shared/components';
import { LockedTable } from './locked-table';
import { sortFunctions } from './sort';

export const LockedSection: FC = () => {
  const { data, isPending: loading } = useOperatorsWithLockedBond();

  return (
    <TableProvider
      data={data}
      sort={sortFunctions}
      defaultSort={{ column: 'until', direction: 'asc' }}
    >
      <Stack direction="column" gap="xl">
        <Block paddingLess overflowHidden data-testid="lockedSectionBlock">
          <WhenLoaded
            loading={loading}
            empty={
              !data?.length && 'There are no Node Operators with Locked bond'
            }
            morePadding
          >
            <LockedTable />
          </WhenLoaded>
        </Block>
        <TablePagination />
      </Stack>
    </TableProvider>
  );
};
