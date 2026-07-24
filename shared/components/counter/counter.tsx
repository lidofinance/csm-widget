import { FC } from 'react';
import { InverseThemeProvider } from '../inverse-theme-provider';
import { COUNTER_VARIANTS, CounterStyle } from './styles';

type CounterProps = {
  count: number | undefined;
  warning?: boolean;
  type?: COUNTER_VARIANTS;
  inverse?: boolean;
  showZero?: boolean;
  'data-testid'?: string;
};

export const Counter: FC<CounterProps> = ({
  warning,
  count,
  type,
  inverse = true,
  showZero = false,
  'data-testid': dataTestid = 'navCounter',
}) => {
  if (!count && !showZero) return null;

  const content = (
    <CounterStyle
      $variant={warning ? 'warning' : type}
      data-testid={dataTestid}
    >
      {count}
    </CounterStyle>
  );

  return inverse ? (
    <InverseThemeProvider>{content}</InverseThemeProvider>
  ) : (
    content
  );
};
