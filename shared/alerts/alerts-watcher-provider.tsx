import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useKeysWithStatus } from 'shared/hooks';
import { AlertRequestToExit } from './components/alert-request-to-exit';
import { useAlertActions } from './alert-provider';

export const AlertsWatcherPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { showAlert, closeAlert } = useAlertActions();

  const { data: keysWithStatus } = useKeysWithStatus();
  const requestedToExit = useMemo(
    () =>
      keysWithStatus?.filter(({ statuses }) =>
        statuses.includes('requested to exit'),
      ),
    [keysWithStatus],
  );

  useEffect(() => {
    if (requestedToExit?.length) {
      showAlert(AlertRequestToExit);
    } else {
      closeAlert(AlertRequestToExit);
    }
  }, [closeAlert, requestedToExit?.length, showAlert]);

  return children;
};
