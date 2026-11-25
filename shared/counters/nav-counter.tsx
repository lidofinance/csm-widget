import { Counter, CounterProps } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

type NavCounterProps = {
  count: number | undefined;
  variant?: CounterProps['variant'];
  testId?: string;
};

export const NavCounter: FC<NavCounterProps> = ({
  count,
  variant,
  testId = 'navCounter',
}) =>
  count ? (
    <Counter variant={variant} dataTestId={{ root: testId }}>
      {count}
    </Counter>
  ) : null;
