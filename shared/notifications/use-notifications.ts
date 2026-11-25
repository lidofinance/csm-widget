import { useContext } from 'react';
import { NotificationsValueContext } from './notifications-provider';

export const useOptionalNotifications = () =>
  useContext(NotificationsValueContext);

export const useNotifications = () => {
  const value = useOptionalNotifications();
  if (!value) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider',
    );
  }
  return value;
};
