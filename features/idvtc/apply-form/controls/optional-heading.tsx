import { Body, Stack, Tag } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';

export const OptionalHeading: FC<PropsWithChildren> = ({ children }) => (
  <Stack direction="row" align="center" gap={8}>
    <Body weight="semibold">{children}</Body>
    <Tag variant="neutral">Optional</Tag>
  </Stack>
);
