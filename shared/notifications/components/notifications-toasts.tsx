import { Button } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { sliceToasts } from '../notifications-state';
import { useIsMobile } from '../use-is-mobile';
import { useOptionalNotifications } from '../use-notifications';
import { NotificationToast } from './notification-toast';
import s from './styles.module.css';

export const NotificationsToasts: FC = () => {
  const value = useOptionalNotifications();
  const isMobile = useIsMobile();

  if (!value || value.isDrawerOpen) return null;

  const { shown, more } = sliceToasts(value.toastQueue, isMobile ? 1 : 3);
  if (shown.length === 0) return null;

  return (
    <div className={s.toastsAnchor}>
      <div className={s.toasts}>
        {shown.map((alert, i) => (
          <NotificationToast
            key={alert.id}
            alert={alert}
            role={i === 0 ? undefined : 'status'}
            fluid={isMobile}
          />
        ))}
        {more > 0 && (
          <Button
            size="small"
            variant="subtle"
            onClick={() => value.setDrawerOpen(true)}
            data-testid="notificationsMore"
          >
            +{more} more
          </Button>
        )}
      </div>
    </div>
  );
};
