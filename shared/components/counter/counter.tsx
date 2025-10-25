import { FC } from 'react';
import { InverseThemeProvider } from '../inverse-theme-provider';
import { COUNTER_VARIANTS, CounterStyle } from './styles';

type CounterProps = {
  count: number | undefined;
  warning?: boolean;
  type?: COUNTER_VARIANTS;
};

export const Counter: FC<CounterProps> = ({ warning, count, type }) =>
  count ? (
    <InverseThemeProvider>
      <CounterStyle $variant={warning ? 'warning' : type}>{count}</CounterStyle>
    </InverseThemeProvider>
  ) : null;
