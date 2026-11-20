import { Card, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import s from './stats-card-shell.module.css';

type StatsCardShellProps = {
  header?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  dataTestId?: string;
  compactOnMobile?: boolean;
};

export const StatsCardShell: FC<StatsCardShellProps> = ({
  header,
  actions,
  children,
  dataTestId,
  compactOnMobile,
}) => (
  <Card
    align="stretch"
    padding={0}
    gap={0}
    clip
    dataTestId={{ root: dataTestId }}
  >
    {header}
    <Stack
      gap={24}
      className={s.body}
      data-compact={compactOnMobile || undefined}
    >
      {children}
      {actions}
    </Stack>
  </Card>
);
