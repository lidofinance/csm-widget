import { Tooltip } from '@lidofinance/lido-ui';
import { DATA_UNAVAILABLE } from 'consts/text';

import { config } from 'config';
import { Component } from 'types';

export type FormatPriceComponent = Component<
  'span',
  { amount: number | null | undefined; currency?: string; approx?: boolean }
>;

export const FormatPrice: FormatPriceComponent = ({
  amount,
  currency = 'USD',
  approx,
  ...rest
}) => {
  const actual =
    amount == null
      ? DATA_UNAVAILABLE
      : amount.toLocaleString(config.LOCALE, {
          style: 'currency',
          currency,
        });
  const prefix = amount && approx ? '≈ ' : '';

  if (amount && amount < 0.01) {
    return (
      <Tooltip
        placement="topRight"
        title={
          <span>
            {amount.toLocaleString(config.LOCALE, {
              style: 'currency',
              currency,
              maximumFractionDigits: 10,
            })}
          </span>
        }
      >
        <span {...rest}>
          {prefix}
          {actual}
        </span>
      </Tooltip>
    );
  }

  return (
    <span {...rest}>
      {prefix}
      {actual}
    </span>
  );
};
