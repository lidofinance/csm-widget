import {
  KEY_STATUS,
  KeyWithStatus,
  OperatorTopUpQueue,
} from '@lidofinance/lido-csm-sdk';
import {
  useModule,
  useNodeOperatorId,
  useOperatorTopUpQueue,
} from 'modules/web3';
import { SortButton, useTable } from 'providers/table-provider';
import { FC } from 'react';
import {
  PriorityChip,
  Pubkey,
  PubkeyLinks,
  Stack,
  KeyStatusChip,
  StatusComment,
} from 'shared/components';
import { useMaxPriorityKeyIndex } from 'shared/hooks';
import { BalanceCell } from './balance-cell';
import { StrikesCount } from './strikes-counts';
import { TableStyle } from './styles';
import { TopUpQueuePosition } from './top-up-queue-position';

const selectTopUpPositions = ({ total, keys }: OperatorTopUpQueue) => ({
  total,
  positions: new Map(keys.map(({ index, position }) => [index, position])),
});

export const KeysTable: FC = () => {
  const maxPriorityKeyIndex = useMaxPriorityKeyIndex();
  const { isCsmFamily, isCSM02, isCM } = useModule();
  const { data } = useTable<KeyWithStatus>();
  const nodeOperatorId = useNodeOperatorId();
  const { data: topUpQueue } = useOperatorTopUpQueue(
    nodeOperatorId,
    selectTopUpPositions,
  );

  const showStrikes = isCsmFamily;
  const showBalance = isCSM02 || isCM;

  return (
    <TableStyle $strikes={showStrikes} $balance={showBalance}>
      <thead>
        <tr>
          <th>
            <SortButton column="pubkey">Key</SortButton>
          </th>
          <th>
            <SortButton column="statuses">Status</SortButton>
          </th>
          {showStrikes && (
            <th>
              <SortButton column="strikes">Strikes</SortButton>
            </th>
          )}
          {showBalance && (
            <th>
              <SortButton column="effectiveBalance">Balance</SortButton>
            </th>
          )}
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {data.map((key) => {
          const topUpPosition = topUpQueue?.positions.get(key.index);

          return (
            <tr key={key.index}>
              <td data-testid="pubkeyCell">
                <Pubkey pubkey={key.pubkey} link={<PubkeyLinks {...key} />} />
              </td>
              <td data-testid="statusCell">
                <Stack direction="column" gap="xs">
                  {key.statuses.map((status) => (
                    <KeyStatusChip
                      status={status}
                      key={status}
                      suffix={
                        status === KEY_STATUS.DEPOSITABLE &&
                        key.index <= maxPriorityKeyIndex ? (
                          <PriorityChip />
                        ) : null
                      }
                    />
                  ))}
                </Stack>
              </td>
              {showStrikes && (
                <td data-testid="strikesCountCell">
                  <StrikesCount strikes={key.strikes} />
                </td>
              )}
              {showBalance && (
                <td data-testid="balanceCell">
                  <BalanceCell effectiveBalance={key.effectiveBalance} />
                </td>
              )}
              <td data-testid="statusCommentCell">
                {topUpPosition !== undefined ? (
                  <Stack direction="column" gap="xs">
                    <TopUpQueuePosition
                      position={topUpPosition}
                      total={topUpQueue?.total}
                    />
                    <StatusComment statuses={key.statuses} />
                  </Stack>
                ) : (
                  <StatusComment statuses={key.statuses} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableStyle>
  );
};
