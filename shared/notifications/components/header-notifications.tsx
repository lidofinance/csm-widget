import { IconBell, IconButton } from '@lidofinance/lido-app-ui';
import { FC, useContext } from 'react';
import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import { useOptionalNotifications } from '../use-notifications';
import { NotificationsDrawer } from './notifications-drawer';

export const HeaderNotifications: FC = () => {
  const value = useOptionalNotifications();
  const operator = useContext(NodeOperatorContext)?.nodeOperator;

  if (!value || !operator) return null;

  const { count, setDrawerOpen } = value;

  return (
    <>
      <IconButton
        variant="surface"
        icon={<IconBell />}
        aria-label="Notifications"
        counter={count || null}
        counterLabel={count ? `${count} unresolved` : undefined}
        onClick={() => setDrawerOpen(true)}
        dataTestId={{ root: 'notificationsBell' }}
      />
      <NotificationsDrawer />
    </>
  );
};
