import { Copy, InfoTooltip } from '@lidofinance/lido-app-ui';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import {
  MODULE_PROFILE,
  TOKENS,
  ValidatorRewardsEntity,
} from '@lidofinance/lido-csm-sdk';
import { useModule } from 'modules/web3';
import { useTable } from 'providers/table-provider';
import { FC } from 'react';
import { Date, Pubkey } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { notifyCopied } from 'shared/hooks';
import { formatPercent } from 'utils';
import { Performance } from './performance';
import { DatesWrapper, Sort, TableStyle } from './styles';

export const RewardsHistoryTable: FC = () => {
  const { module } = useModule();
  const { data } = useTable<ValidatorRewardsEntity>();

  const showBalance = !!module && MODULE_PROFILE[module].allocatedBalance;

  return (
    <TableStyle $balance={showBalance}>
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
            <Sort column="receivedRewards">Rewards</Sort>
            <InfoTooltip
              dataTestId={ICON_TOOLTIP_TEST_ID}
              content={
                showBalance
                  ? "Rewards depend on the key's fee, performance, and balance throughout the reporting frame"
                  : "Rewards depend on the key's fee and performance throughout the reporting frame"
              }
            />
          </th>
          {showBalance && (
            <th>
              <Sort column="effectiveBalance">Balance</Sort>
              <InfoTooltip
                dataTestId={ICON_TOOLTIP_TEST_ID}
                content="Shows the balance at the end of the reporting frame. Balance changes during the reporting frame can affect rewards."
              />
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td>
              <DatesWrapper>
                <Date timestamp={record.startTimestamp} format="yyyy, MMM dd" />{' '}
                &mdash; <Date timestamp={record.endTimestamp} />
              </DatesWrapper>
            </td>
            <td>
              {record.pubkey ? (
                <Pubkey
                  pubkey={record.pubkey}
                  symbols={6}
                  link={<Copy text={record.pubkey} onCopy={notifyCopied} />}
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
            {showBalance && (
              <td>
                <FormatToken
                  amount={record.effectiveBalance}
                  token={TOKENS.steth}
                  trimTrailingZeros
                  fallback="—"
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
