import { KEY_STATUS, ROLES } from '@lidofinance/lido-csm-sdk';
import {
  useNodeOperator,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useCanClaimICS } from 'shared/hooks';
import { useAlertActions } from './alert-provider';
import { AlertLockedBond } from './components/alert-locked-bond';
import { AlertNomalizeQueue } from './components/alert-normalize-queue';
import { AlertRequestToExit } from './components/alert-request-to-exit';
import { AlertTransferKeys } from './components/alert-transfer-keys';
import { useOperatorKeysToMigrate } from 'modules/web3/hooks/use-operator-keys-to-migrate';
import { AlertClaimIcs } from './components/alert-claim-ics';
import { useRouter } from 'next/router';
import { PATH } from 'consts';

export const AlertsWatcherPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { showAlert, closeAlert } = useAlertActions();

  const { nodeOperator } = useNodeOperator();
  const { data: info } = useOperatorInfo(nodeOperator?.id);
  const { data: keysToTransfer } = useOperatorKeysToMigrate(nodeOperator?.id);
  const canClaimICS = useCanClaimICS();
  const { route } = useRouter();

  const normalizeQueue = useMemo(() => {
    return (
      info &&
      info.enqueuedCount < info.depositableValidatorsCount &&
      nodeOperator?.roles?.includes(ROLES.MANAGER)
    );
  }, [info, nodeOperator?.roles]);

  const { data: balance } = useOperatorBalance(nodeOperator?.id);

  const { data: keysWithStatus, isPending: isKeysLoading } =
    useOperatorKeysWithStatus(nodeOperator?.id);
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
    if (keysToTransfer) {
      showAlert(AlertTransferKeys);
    } else {
      closeAlert(AlertTransferKeys);
    }
  }, [closeAlert, keysToTransfer, showAlert]);

  useEffect(() => {
    if (balance?.locked) {
      showAlert(AlertLockedBond);
    } else {
      closeAlert(AlertLockedBond);
    }
  }, [balance?.locked, closeAlert, showAlert]);

  useEffect(() => {
    if (canClaimICS && route !== PATH.TYPE_CLAIM) {
      showAlert(AlertClaimIcs);
    } else {
      closeAlert(AlertClaimIcs);
    }
  }, [canClaimICS, closeAlert, route, showAlert]);

  return <>{children}</>;
};
