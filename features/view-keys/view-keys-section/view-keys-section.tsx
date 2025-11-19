import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { TablePagination, TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import { Block, Stack, WhenLoaded } from 'shared/components';
import { KeysTable } from './keys-table';
import { sortFunctions } from './sort';

export const ViewKeysSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys, isPending: loading } =
    useOperatorKeysWithStatus(nodeOperatorId);

  return (
    <TableProvider
      data={keys}
      sort={sortFunctions}
      defaultSort={{ column: 'statuses', direction: 'asc' }}
    >
      <Stack direction="column" gap="xl">
        <Block paddingLess data-testid="viewKeysBlock">
          <WhenLoaded
            loading={loading}
            empty={!keys?.length && 'There are no keys to display'}
            morePadding
          >
            <KeysTable />
          </WhenLoaded>
        </Block>
        <TablePagination />
      </Stack>
    </TableProvider>
  );
};
