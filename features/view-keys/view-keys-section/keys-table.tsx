import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { ArrowBottom, ArrowTop } from '@lidofinance/lido-ui';
import { FC, useCallback, useMemo, useState } from 'react';
import {
  PriorityChip,
  Pubkey,
  PubkeyLinks,
  Stack,
  StatusChip,
  StatusComment,
} from 'shared/components';
import {
  sortByPubkey,
  sortByPubkeyDesc,
  sortByStatus,
  sortByStatusDesc,
  sortByStrikes,
  sortByStrikesDesc,
  useMaxPriorityKeyIndex,
  useSortedKeys,
} from 'shared/hooks';
import { StrikesCount } from './strikes-counts';
import { SortButton, TableStyle } from './styles';

type Props = {
  keys?: KeyWithStatus[];
};

type SortProps = {
  column: 'key' | 'status' | 'strikes';
  asc: boolean;
};

export const KeysTable: FC<Props> = ({ keys }) => {
  const maxPriorityKeyIndex = useMaxPriorityKeyIndex();

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
      case sortBy.column === 'strikes' && sortBy.asc:
        return sortByStrikes;
      case sortBy.column === 'strikes' && !sortBy.asc:
        return sortByStrikesDesc;
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
          <th>
            <SortButton onClick={() => handleSort('strikes')}>
              Strikes
              {sortBy.column === 'strikes' &&
                (sortBy.asc ? <ArrowTop /> : <ArrowBottom />)}
            </SortButton>
          </th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {sortedKeys.map(
          ({ pubkey, index, statuses, strikes, validatorIndex }) => (
            <tr key={index}>
              <td data-testid="pubkeyCell">
                <Pubkey
                  pubkey={pubkey}
                  link={<PubkeyLinks {...{ pubkey, validatorIndex }} />}
                />
              </td>
              <td data-testid="statusCell">
                <Stack direction="column" gap="xs">
                  {statuses.map((status) => (
                    <StatusChip
                      status={status}
                      key={status}
                      suffix={
                        status === KEY_STATUS.DEPOSITABLE &&
                        index <= maxPriorityKeyIndex ? (
                          <PriorityChip />
                        ) : null
                      }
                    />
                  ))}
                </Stack>
              </td>
              <td data-testid="strikesCountCell">
                <StrikesCount strikes={strikes} />
              </td>
              <td data-testid="statusCommentCell">
                <StatusComment statuses={statuses} />
              </td>
            </tr>
          ),
        )}
      </tbody>
    </TableStyle>
  );
};
