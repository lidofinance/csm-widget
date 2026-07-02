import { FC } from 'react';
import { InverseThemeProvider } from '../inverse-theme-provider';
import { COUNTER_VARIANTS, CounterStyle } from './styles';

type CounterProps = {
  count: number | undefined;
  warning?: boolean;
  type?: COUNTER_VARIANTS;
  'data-testid'?: string;
};

export const Counter: FC<CounterProps> = ({
  warning,
  count,
  type,
  'data-testid': dataTestid = 'navCounter',
}) =>
  count ? (
    <InverseThemeProvider>
      <CounterStyle
        $variant={warning ? 'warning' : type}
        data-testid={dataTestid}
      >
        {count}
      </CounterStyle>
    </InverseThemeProvider>
  ) : null;
