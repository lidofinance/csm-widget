import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack } from '../stack/stack';
import { Text } from '@lidofinance/lido-ui';

export const FormTitle: FC<PropsWithChildren<{ extra?: ReactNode }>> = ({
  children,
  extra,
}) => (
  <Stack spaceBetween center gap="xs">
    <Text size="sm" weight={700}>
      {children}
    </Text>
    {extra}
  </Stack>
);
