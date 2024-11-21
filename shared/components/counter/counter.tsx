import { FC } from 'react';
import { InverseThemeProvider } from '../inverse-theme-provider';
import { CounterStyle } from './styles';

type CounterProps = { count?: number; warning?: boolean };

export const Counter: FC<CounterProps> = ({ warning, count }) =>
  count ? (
    <InverseThemeProvider>
      <CounterStyle $warning={warning}>{count}</CounterStyle>
    </InverseThemeProvider>
  ) : null;
