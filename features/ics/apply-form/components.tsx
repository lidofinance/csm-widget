import { Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'shared/components';

import { Chip as BaseChip } from '@lidofinance/lido-ui';
import styled from 'styled-components';

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

export const Chip = styled(BaseChip).attrs({ variant: 'gray' })`
  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  vertical-align: middle;
`;
