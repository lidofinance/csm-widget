import { Tooltip } from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts/text';

import { config } from 'config';
import { Component } from 'types';
import cn from 'classnames';
import s from './format-price.module.css';

export type FormatPriceComponent = Component<
  'span',
  { amount: number | null | undefined; currency?: string; approx?: boolean }
>;

export const FormatPrice: FormatPriceComponent = ({
  amount,
  currency = 'USD',
  approx,
  className,
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

  if (amount !== null && amount !== undefined && amount < 0.01) {
    return (
      <Tooltip
        position="top-right"
        content={
          <span>
            {amount.toLocaleString(config.LOCALE, {
              style: 'currency',
              currency,
              maximumFractionDigits: 10,
            })}
          </span>
        }
      >
        <span {...rest} className={cn(s.price, className)}>
          {prefix}
          {actual}
        </span>
      </Tooltip>
    );
  }

  return (
    <span {...rest} className={cn(s.price, className)}>
      {prefix}
      {actual}
    </span>
  );
};
