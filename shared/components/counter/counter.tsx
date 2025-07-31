import { FC } from 'react';
import { InverseThemeProvider } from '../inverse-theme-provider';
import { CounterStyle } from './styles';
import { OPERATOR_TYPE } from 'consts';

type CounterProps = { count?: number; warning?: boolean; type?: OPERATOR_TYPE };

export const Counter: FC<CounterProps> = ({ warning, count, type }) =>
  count ? (
    <InverseThemeProvider>
      <CounterStyle $warning={warning} $variant={type}>
        {count}
      </CounterStyle>
    </InverseThemeProvider>
  ) : null;
