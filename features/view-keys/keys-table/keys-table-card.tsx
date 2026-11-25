import { Card, Divider, Stack } from '@lidofinance/lido-app-ui';
import {
  useModule,
  useNodeOperatorId,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { TableProvider, useTable } from 'providers/table-provider';
import cn from 'classnames';
import { FC, useLayoutEffect, useMemo } from 'react';
import { hasStatus, selectKeysBreakdown, STATUS_GROUPS } from 'utils';
import {
  getStatusChips,
  StatusChipId,
  StatusFilterChips,
  useStatusFilter,
} from '../status-filter';
import { KeysEmpty } from './keys-empty';
import { KeysSkeleton } from './keys-skeleton';
import { KeysTable } from './keys-table';
import { sortFunctions } from './sort';
import s from './styles.module.css';

const PageReset: FC<{ status: StatusChipId | undefined }> = ({ status }) => {
  const { setPage } = useTable();
  useLayoutEffect(() => setPage(0), [status, setPage]);
  return null;
};

export const KeysTableCard: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isCsmFamily } = useModule();
  const { data: keys, isPending } = useOperatorKeysWithStatus({
    nodeOperatorId,
  });

  const chips = useMemo(
    () =>
      getStatusChips(selectKeysBreakdown(keys ?? []).counts, { isCsmFamily }),
    [keys, isCsmFamily],
  );
  const { status, setStatus } = useStatusFilter(chips);

  const filteredKeys = useMemo(
    () => (status ? keys?.filter(hasStatus(STATUS_GROUPS[status])) : keys),
    [keys, status],
  );

  if (isPending) return <KeysSkeleton />;
  if (!keys?.length) return <KeysEmpty />;

  return (
    <TableProvider
      data={filteredKeys}
      sort={sortFunctions}
      defaultSort={{ column: 'statuses', direction: 'asc' }}
    >
      <PageReset status={status} />
      <Card
        align="stretch"
        padding={0}
        gap={0}
        clip
        dataTestId={{ root: 'viewKeysBlock' }}
      >
        <Stack className={cn(s.chipsArea, s.chipsAreaSpaced)}>
          <StatusFilterChips
            chips={chips}
            status={status}
            onChange={setStatus}
          />
        </Stack>
        <Divider />
        <KeysTable />
      </Card>
    </TableProvider>
  );
};
