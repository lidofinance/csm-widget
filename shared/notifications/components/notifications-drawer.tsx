import { Divider, Drawer, EmptyState, Stack } from '@lidofinance/lido-app-ui';
import { FC, Fragment } from 'react';
import { useNotifications } from '../use-notifications';
import { NotificationItem } from './notification-item';
import s from './styles.module.css';

export const NotificationsDrawer: FC = () => {
  const { alerts, isDrawerOpen, setDrawerOpen } = useNotifications();

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => setDrawerOpen(false)}
      title="Notifications"
      width={500}
      dataTestId={{ root: 'notificationsDrawer' }}
    >
      {alerts.length > 0 ? (
        <Stack gap={32} className={s.list}>
          {alerts.map((alert, i) => (
            <Fragment key={alert.id}>
              {i > 0 && <Divider />}
              <NotificationItem alert={alert} />
            </Fragment>
          ))}
        </Stack>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="Alerts about your Node Operator will appear here"
          fill
        />
      )}
    </Drawer>
  );
};
