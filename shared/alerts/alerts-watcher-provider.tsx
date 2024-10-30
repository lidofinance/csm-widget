import { checkCookieAllowed } from '@lidofinance/analytics-matomo';
import { ROLES } from 'consts/roles';
import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import {
  useAskHowDidYouLearnCsm,
  useKeysWithStatus,
  useNodeOperatorInfo,
  useNodeOperatorLockAmount,
} from 'shared/hooks';
import { useAlertActions } from './alert-provider';
import { AlertHowDidYouLearCsm } from './components/alert-how-did-you-learn-csm';
import { AlertLockedBond } from './components/alert-locked-bond';
import { AlertNomalizeQueue } from './components/alert-normalize-queue';
import { AlertRequestToExit } from './components/alert-request-to-exit';
import { AlertStuckKeys } from './components/alert-stuck-keys';

export const AlertsWatcherPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { showAlert, closeAlert } = useAlertActions();

  const { canAsk, answer, rejectAnswer } = useAskHowDidYouLearnCsm();

  const nodeOperator = useActiveNodeOperator();
  const { data: info } = useNodeOperatorInfo(nodeOperator?.id);

  const normalizeQueue = useMemo(() => {
    return (
      info &&
      info.enqueuedCount < info.depositableValidatorsCount &&
      info.stuckValidatorsCount === 0 &&
      nodeOperator?.roles.includes(ROLES.MANAGER)
    );
  }, [info, nodeOperator?.roles]);

  const { data: lockedBond } = useNodeOperatorLockAmount(nodeOperator?.id);

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

  useEffect(() => {
    if (info?.stuckValidatorsCount) {
      showAlert(AlertStuckKeys);
    } else {
      closeAlert(AlertStuckKeys);
    }
  }, [closeAlert, info?.stuckValidatorsCount, showAlert]);

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

  useEffect(() => {
    const allowed = checkCookieAllowed();
    if (allowed && canAsk) {
      showAlert(AlertHowDidYouLearCsm, {
        onClose: () => {
          rejectAnswer();
          closeAlert(AlertHowDidYouLearCsm);
        },
        onAnswer() {
          answer();

          setTimeout(() => {
            closeAlert(AlertHowDidYouLearCsm);
          }, 3000);
        },
      });
    }
  }, [answer, canAsk, closeAlert, rejectAnswer, showAlert]);

  return children;
};
