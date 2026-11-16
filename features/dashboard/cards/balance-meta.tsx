import { StatCardMetaItem, Typography } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FormatToken } from 'shared/formatters';
import type { BalanceMetaItem } from '../utils/get-balance-meta-items';

export const toBalanceMetaItems = (
  items: BalanceMetaItem[],
): StatCardMetaItem[] =>
  items.map(({ label, amount, symbol, tone, testid }) => ({
    label,
    value: (
      <Typography
        as="span"
        color={tone === 'error' ? 'error' : undefined}
        data-testid={testid}
      >
        <FormatToken
          amount={amount}
          trimTrailingZeros
          token={symbol === 'ETH' ? TOKENS.eth : TOKENS.steth}
        />
      </Typography>
    ),
  }));
