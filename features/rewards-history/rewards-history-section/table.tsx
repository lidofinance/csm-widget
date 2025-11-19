import { TOKENS, ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { SortButton, useTable } from 'providers/table-provider';
import { FC } from 'react';
import { CopyLink, Date, Pubkey } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { formatPercent } from 'utils';
import { Performance } from './performance';
import { DatesWrapper, TableStyle } from './styles';

export const Table: FC = () => {
  const { data } = useTable<ValidatorRewardsEntity>();

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>
            <SortButton column="startTimestamp">Date period</SortButton>
          </th>
          <th>
            <SortButton column="pubkey">Key</SortButton>
          </th>
          <th>
            <SortButton column="fee">Fee</SortButton>
          </th>
          <th>
            <SortButton column="performance">Performance</SortButton>
          </th>
          <th>
            <SortButton column="threshold">Threshold</SortButton>
          </th>
          <th>
            <SortButton column="receivedRewards">Rewards received</SortButton>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td>
              <DatesWrapper>
                <Date timestamp={record.startTimestamp} /> &mdash;{' '}
                <Date timestamp={record.endTimestamp} />
              </DatesWrapper>
            </td>
            <td>
              {record.pubkey ? (
                <Pubkey
                  pubkey={record.pubkey}
                  symbols={6}
                  link={<CopyLink text={record.pubkey} />}
                />
              ) : (
                record.validatorIndex
              )}
            </td>
            <td>{formatPercent(record.fee)}</td>
            <td>
              <Performance {...record} />
            </td>
            <td>{formatPercent(record.threshold)}</td>
            <td>
              <FormatToken
                amount={record.receivedRewards}
                token={TOKENS.steth}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
