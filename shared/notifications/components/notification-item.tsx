import { Body, Description, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatDate } from 'utils/format-date';
import { ALERT_DEFINITIONS } from '../definitions';
import type { Alert } from '../types';
import { useNotifications } from '../use-notifications';
import { DismissButton } from './dismiss-button';
import s from './styles.module.css';

export const NotificationItem: FC<{ alert: Alert }> = ({ alert }) => {
  const def = ALERT_DEFINITIONS[alert.type];
  const { setDrawerOpen } = useNotifications();

  return (
    <Stack data-testid={`notificationItem-${alert.type}`}>
      <Description color="secondary">
        {formatDate(new Date(alert.firstSeenAt), 'MMM d, yyyy')}
      </Description>
      <Body weight="medium" as="h3">
        {def.title}
      </Body>
      <div className={s.itemBody}>
        <Body as="div">
          <def.Body {...(alert.props as object)} />
        </Body>
      </div>
      <Stack direction="row" wrap gap={8} className={s.itemActions}>
        <def.Actions
          {...(alert.props as object)}
          isActiveOperator
          onNavigate={() => setDrawerOpen(false)}
        />
        <DismissButton alert={alert} />
      </Stack>
    </Stack>
  );
};
