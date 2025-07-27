import { Tooltip } from '@lidofinance/lido-ui';
import { DATA_UNAVAILABLE } from 'consts/text';

import { config } from 'config';
import { Component } from 'types';
import styled from 'styled-components';

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

  if (amount !== null && amount !== undefined && amount < 0.01) {
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
        <Price {...rest}>
          {prefix}
          {actual}
        </Price>
      </Tooltip>
    );
  }

  return (
    <Price {...rest}>
      {prefix}
      {actual}
    </Price>
  );
};

const Price = styled.span`
  white-space: nowrap;
`;
