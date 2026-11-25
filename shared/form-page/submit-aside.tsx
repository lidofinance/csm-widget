import { DataList, Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';

export type SubmitAsideProps = PropsWithChildren<{
  confirm?: ReactNode;
  rows?: ReactNode;
}>;

export const SubmitAside: FC<SubmitAsideProps> = ({
  confirm,
  rows,
  children,
}) => (
  <Stack gap={24}>
    {confirm}
    {rows && <DataList divided>{rows}</DataList>}
    <Stack gap={12}>{children}</Stack>
  </Stack>
);
