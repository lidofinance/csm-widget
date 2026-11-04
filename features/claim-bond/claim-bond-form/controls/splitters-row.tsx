import { DataList, DataListRow } from '@lidofinance/lido-app-ui';
import { FeeSplit, PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { Disclosure } from 'shared/ui';
import { SplittersSummaryStyle } from '../styles';

type SplittersRowProps = {
  feeSplits: FeeSplit[];
  amount: bigint;
};

const splitAmount = (amount: bigint, share: bigint) =>
  (amount * share) / PERCENT_BASIS;

export const SplittersRow: FC<SplittersRowProps> = ({ feeSplits, amount }) => {
  const total = feeSplits.reduce(
    (sum, split) => sum + splitAmount(amount, split.share),
    0n,
  );

  return (
    <Disclosure
      data-testid="splittersAccordion"
      label={
        <SplittersSummaryStyle data-testid="splittersSummary">
          <span>Splitter addresses ({feeSplits.length}) will receive</span>
          <span data-testid="splittersTotalAmount">
            <FormatToken amount={total} token={TOKENS.steth} />
          </span>
        </SplittersSummaryStyle>
      }
    >
      <DataList>
        {feeSplits.map((split) => (
          <DataListRow
            key={split.recipient}
            label={
              <Address
                address={split.recipient}
                size="xxs"
                weight={700}
                color="secondary"
                noStyle
              />
            }
            value={
              <FormatToken
                amount={splitAmount(amount, split.share)}
                token={TOKENS.steth}
              />
            }
            dataTestId={{ root: 'splitterRecipient' }}
          />
        ))}
      </DataList>
    </Disclosure>
  );
};
