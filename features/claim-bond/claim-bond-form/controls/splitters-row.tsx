import {
  DataList,
  DataListRow,
  Disclosure,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FeeSplit, PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';

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
      dataTestId={{ root: 'splittersAccordion' }}
      label={
        <Stack
          as="span"
          direction="row"
          align="center"
          justify="between"
          gap={8}
          style={{ flex: 1 }}
        >
          <span data-testid="splittersSummary">
            To splitters ({feeSplits.length})
          </span>
          <span data-testid="splittersTotalAmount">
            <FormatToken amount={total} token={TOKENS.steth} />
          </span>
        </Stack>
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
