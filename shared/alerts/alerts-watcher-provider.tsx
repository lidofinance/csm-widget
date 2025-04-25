import { KEY_STATUS } from 'consts/key-status';
import { ROLES } from 'consts/roles';
import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import {
  useKeysWithStatus,
  useNodeOperatorInfo,
  useNodeOperatorLockAmount,
} from 'shared/hooks';
import { useAlertActions } from './alert-provider';
import { AlertLockedBond } from './components/alert-locked-bond';
import { AlertNomalizeQueue } from './components/alert-normalize-queue';
import { AlertRequestToExit } from './components/alert-request-to-exit';

export const AlertsWatcherPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { showAlert, closeAlert } = useAlertActions();

  const nodeOperator = useActiveNodeOperator();
  const { data: info } = useNodeOperatorInfo(nodeOperator?.id);

  const normalizeQueue = useMemo(() => {
    return (
      info &&
      info.enqueuedCount < info.depositableValidatorsCount &&
      nodeOperator?.roles.includes(ROLES.MANAGER)
    );
  }, [info, nodeOperator?.roles]);

  const { data: lockedBond } = useNodeOperatorLockAmount(nodeOperator?.id);

  const { data: keysWithStatus, initialLoading: isKeysLoading } =
    useKeysWithStatus();
  const hasRequestsToExit = useMemo(
    () =>
      keysWithStatus?.filter(({ statuses }) =>
        statuses.includes(KEY_STATUS.EXIT_REQUESTED),
      ).length,
    [keysWithStatus],
  );

  useEffect(() => {
    if (!isKeysLoading) {
      if (hasRequestsToExit) {
        showAlert(AlertRequestToExit);
      } else {
        closeAlert(AlertRequestToExit);
      }
    }
  }, [closeAlert, hasRequestsToExit, isKeysLoading, showAlert]);

  useEffect(() => {
    if (normalizeQueue) {
      showAlert(AlertNomalizeQueue);
    } else {
      closeAlert(AlertNomalizeQueue);
    }
  }, [closeAlert, normalizeQueue, showAlert]);

  useEffect(() => {
    if (lockedBond?.gt(0)) {
      showAlert(AlertLockedBond);
    } else {
      closeAlert(AlertLockedBond);
    }
  }, [closeAlert, lockedBond, showAlert]);

  return <>{children}</>;
};
