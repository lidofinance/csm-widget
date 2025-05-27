import { ROLES } from '@lidofinance/lido-csm-sdk/common';
import { KEY_STATUS } from 'consts/key-status';
import {
  useNodeOperator,
  useOperatorBalance,
  useOperatorInfo,
} from 'modules/web3';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useKeysWithStatus } from 'shared/hooks';
import { useAlertActions } from './alert-provider';
import { AlertLockedBond } from './components/alert-locked-bond';
import { AlertNomalizeQueue } from './components/alert-normalize-queue';
import { AlertRequestToExit } from './components/alert-request-to-exit';

export const AlertsWatcherPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { showAlert, closeAlert } = useAlertActions();

  const { nodeOperator } = useNodeOperator();
  const { data: info } = useOperatorInfo(nodeOperator?.id);

  const normalizeQueue = useMemo(() => {
    return (
      info &&
      info.enqueuedCount < info.depositableValidatorsCount &&
      nodeOperator?.roles.includes(ROLES.MANAGER)
    );
  }, [info, nodeOperator?.roles]);

  const { data: balance } = useOperatorBalance(nodeOperator?.id);

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
    if (balance?.locked) {
      showAlert(AlertLockedBond);
    } else {
      closeAlert(AlertLockedBond);
    }
  }, [balance?.locked, closeAlert, showAlert]);

  return <>{children}</>;
};
