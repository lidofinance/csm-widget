import { ArrowBottom, ArrowTop } from '@lidofinance/lido-ui';
import { FC, useCallback, useMemo, useState } from 'react';
import {
  BeaconchainPubkeyLink,
  CopyLink,
  MigalabsPubkeyLink,
  Pubkey,
  Stack,
  StatusChip,
  StatusComment,
} from 'shared/components';
import {
  KeyWithStatus,
  sortByPubkey,
  sortByPubkeyDesc,
  sortByStatus,
  sortByStatusDesc,
  useSortedKeys,
} from 'shared/hooks';
import { SortButton, TableStyle } from './styles';

type Props = {
  keys?: KeyWithStatus[];
};

type SortProps = {
  column: 'key' | 'status';
  asc: boolean;
};

export const KeysTable: FC<Props> = ({ keys }) => {
  const [sortBy, setSortBy] = useState<SortProps>({
    column: 'status',
    asc: true,
  });
  const sortFn = useMemo(() => {
    switch (true) {
      case sortBy.column === 'key' && sortBy.asc:
        return sortByPubkey;
      case sortBy.column === 'key' && !sortBy.asc:
        return sortByPubkeyDesc;
      case sortBy.column === 'status' && sortBy.asc:
        return sortByStatus;
      case sortBy.column === 'status' && !sortBy.asc:
        return sortByStatusDesc;
      default:
        return sortByStatus;
    }
  }, [sortBy.column, sortBy.asc]);
  const sortedKeys = useSortedKeys(keys, sortFn);

  const handleSort = useCallback((column: SortProps['column']) => {
    setSortBy((prev) => ({
      column,
      asc: prev.column === column ? !prev.asc : true,
    }));
  }, []);

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>
            <SortButton onClick={() => handleSort('key')}>
              Key
              {sortBy.column === 'key' &&
                (sortBy.asc ? <ArrowTop /> : <ArrowBottom />)}
            </SortButton>
          </th>
          <th>
            <SortButton onClick={() => handleSort('status')}>
              Status
              {sortBy.column === 'status' &&
                (sortBy.asc ? <ArrowTop /> : <ArrowBottom />)}
            </SortButton>
          </th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {sortedKeys?.map(({ key, index, statuses, validatorIndex }) => (
          <tr key={index}>
            <td data-testid="pubkeyCell">
              <Pubkey
                address={key}
                link={
                  <>
                    <CopyLink text={key} data-testid="pubkeyLink" />
                    <BeaconchainPubkeyLink pubkey={key} statuses={statuses} />
                    <MigalabsPubkeyLink validator={validatorIndex} />
                  </>
                }
              />
            </td>
            <td data-testid="statusCell">
              <Stack direction="column" gap="xs">
                {statuses.map((status) => (
                  <StatusChip status={status} key={status} />
                ))}
              </Stack>
            </td>
            <td data-testid="statusCommentCell">
              <StatusComment statuses={statuses} />
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
