import {
  DataList,
  DataListRow,
  IconChevronDown,
} from '@lidofinance/lido-app-ui';
import { FeeSplit, PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC, useId, useState } from 'react';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { DisclosureBodyStyle, DisclosureHeaderStyle } from '../styles';

type SplittersRowProps = {
  feeSplits: FeeSplit[];
  amount: bigint;
};

const splitAmount = (amount: bigint, share: bigint) =>
  (amount * share) / PERCENT_BASIS;

export const SplittersRow: FC<SplittersRowProps> = ({ feeSplits, amount }) => {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const total = feeSplits.reduce(
    (sum, split) => sum + splitAmount(amount, split.share),
    0n,
  );

  return (
    <div data-testid="splittersAccordion">
      <DisclosureHeaderStyle
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((value) => !value)}
      >
        <span data-testid="splittersSummary">
          To splitters ({feeSplits.length})
        </span>
        <span>
          <span data-testid="splittersTotalAmount">
            <FormatToken amount={total} token={TOKENS.steth} />
          </span>
          <IconChevronDown data-open={open} />
        </span>
      </DisclosureHeaderStyle>
      {open && (
        <DisclosureBodyStyle id={bodyId}>
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
        </DisclosureBodyStyle>
      )}
    </div>
  );
};
