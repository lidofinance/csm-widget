import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DATA_UNAVAILABLE } from 'consts/text';
import { ReactNode } from 'react';
import { FormatToken } from 'shared/formatters';
import { formatPercent, pluralKeys } from 'utils';
import type { ClaimTypeSummary } from './claim-type-summary';
import { FaintStyle } from './styles';

export type ClaimSummaryRow = {
  label: string;
  render: (summary?: ClaimTypeSummary) => ReactNode;
};

const renderReward = (summary?: ClaimTypeSummary): ReactNode => {
  if (summary?.reward === undefined) return DATA_UNAVAILABLE;

  return (
    <>
      {formatPercent(summary.reward)}
      {summary.rewardKeys !== undefined && (
        <FaintStyle>
          for {pluralKeys({ value: summary.rewardKeys, showValue: true })}
        </FaintStyle>
      )}
    </>
  );
};

export const CLAIM_SUMMARY_ROWS: ClaimSummaryRow[] = [
  {
    label: 'Bond for the first key',
    render: (summary) =>
      summary?.bondFirstKey === undefined ? (
        DATA_UNAVAILABLE
      ) : (
        <FormatToken amount={summary.bondFirstKey} token={TOKENS.eth} />
      ),
  },
  { label: 'Node Operator reward', render: renderReward },
  {
    label: 'Keys in priority queue',
    render: (summary) => summary?.priorityKeys ?? DATA_UNAVAILABLE,
  },
];
