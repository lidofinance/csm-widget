import { BigNumber } from '@ethersproject/bignumber';
import { Tooltip } from '@lidofinance/lido-ui';

import { DATA_UNAVAILABLE } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { Component } from 'types';
import {
  FormatBalanceArgs,
  getTokenDisplayName,
  useFormattedBalance,
} from 'utils';

export type FormatTokenProps = FormatBalanceArgs & {
  symbol?: string;
  token?: TOKENS;
  amount?: BigNumber;
  approx?: boolean;
  fallback?: string;
};
export type FormatTokenComponent = Component<'span', FormatTokenProps>;

export const FormatToken: FormatTokenComponent = ({
  amount,
  token,
  symbol: _symbol,
  approx,
  maxDecimalDigits = 4,
  maxTotalLength = 15,
  fallback = DATA_UNAVAILABLE,
  adaptiveDecimals,
  ...rest
}) => {
  const { actual, trimmed } = useFormattedBalance(amount, {
    maxDecimalDigits,
    maxTotalLength,
    adaptiveDecimals,
  });

  if (!amount) return <span {...rest}>{fallback}</span>;

  const symbol = _symbol ?? (token ? getTokenDisplayName(token) : '');

  // we show prefix for non zero amount and if we need to show Tooltip Amount
  // overridden by explicitly set approx
  const prefix = amount && !amount.isZero() && approx ? '≈ ' : '';

  const body = (
    <span {...rest}>
      {prefix}
      {trimmed}&nbsp;{symbol}
    </span>
  );

  return (
    <Tooltip
      placement="topRight"
      title={
        <span>
          {actual}&nbsp;{symbol}
        </span>
      }
    >
      {body}
    </Tooltip>
  );
};
