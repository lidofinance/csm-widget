import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack } from '../stack/stack';
import { Text } from '@lidofinance/lido-ui';

export const FormTitle: FC<
  PropsWithChildren<{ chip?: ReactNode; extra?: ReactNode }>
> = ({ children, chip, extra }) => (
  <Stack spaceBetween center gap="xs">
    <Stack center gap="sm">
      <Text as="h4" size="sm" weight={700}>
        {children}
      </Text>
      {chip}
    </Stack>
    {extra}
  </Stack>
);
