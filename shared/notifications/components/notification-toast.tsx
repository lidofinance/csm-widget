import { Notification } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ALERT_DEFINITIONS } from '../definitions';
import type { Alert } from '../types';
import { useNotifications } from '../use-notifications';
import { DismissButton } from './dismiss-button';

type Props = { alert: Alert; role?: 'status'; fluid?: boolean };

export const NotificationToast: FC<Props> = ({ alert, role, fluid }) => {
  const def = ALERT_DEFINITIONS[alert.type];
  const { closeToast } = useNotifications();
  const close = () => closeToast(alert);

  return (
    <Notification
      title={def.title}
      onClose={close}
      role={role}
      fluid={fluid}
      data-testid={def.testId}
      actions={
        <>
          <def.Actions
            {...(alert.props as object)}
            isActiveOperator
            onNavigate={close}
          />
          <DismissButton alert={alert} />
        </>
      }
    >
      <def.Body {...(alert.props as object)} />
    </Notification>
  );
};
