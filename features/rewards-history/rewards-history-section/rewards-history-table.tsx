import { TOKENS, ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { useTable } from 'providers/table-provider';
import { FC } from 'react';
import { CopyLink, Date, Pubkey } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { formatPercent } from 'utils';
import { Performance } from './performance';
import { DatesWrapper, Sort, TableStyle } from './styles';

export const RewardsHistoryTable: FC = () => {
  const { data } = useTable<ValidatorRewardsEntity>();

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>
            <Sort column="startTimestamp">Date period</Sort>
          </th>
          <th>
            <Sort column="pubkey">Key</Sort>
          </th>
          <th>
            <Sort column="fee">Fee</Sort>
          </th>
          <th>
            <Sort column="performance">Performance</Sort>
          </th>
          <th>
            <Sort column="threshold">Threshold</Sort>
          </th>
          <th>
            <Sort column="receivedRewards">Rewards received</Sort>
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
