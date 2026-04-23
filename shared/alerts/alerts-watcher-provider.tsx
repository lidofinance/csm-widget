import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { ALERT_FEE_RECIPIENT_DISMISS_HOURS, isModuleCM, PATH } from 'consts';
import {
  useIsLockExpired,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import {
  useDappStatus,
  useOperatorKeysWithWrongFeeRecipient,
} from 'modules/web3/hooks';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useMemo } from 'react';
import { useCanClaimICS, useDismiss } from 'shared/hooks';
import { useAlertActions } from './alert-provider';
import { AlertClaimIcs } from './components/alert-claim-ics';
import { AlertExpiredLockedBond } from './components/alert-expired-locked-bond';
import { AlertLockedBond } from './components/alert-locked-bond';
import { AlertNomalizeQueue } from './components/alert-normalize-queue';
import { AlertRequestToExit } from './components/alert-request-to-exit';
import { AlertUnsupportedChain } from './components/alert-unsupported-chain';
import { AlertWrongFeeRecipient } from './components/alert-wrong-fee-recipient';
import { useAlertWatcher } from './use-alert-watcher';

export const AlertsWatcherProvider: FC<PropsWithChildren> = ({ children }) => {
  const { closeAlert } = useAlertActions();

  const { isSupportedChain } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const canClaimICS = useCanClaimICS();
  const { route } = useRouter();

  const normalizeQueue = useMemo(() => {
    return info && info.enqueuedCount < info.depositableValidatorsCount;
  }, [info]);

  const { data: balance } = useOperatorBalance(nodeOperatorId);
  const { data: isLockExpired } = useIsLockExpired(nodeOperatorId);

  const { data: keysWithStatus, isPending: isKeysLoading } =
    useOperatorKeysWithStatus(nodeOperatorId);
  const hasRequestsToExit = useMemo(
    () =>
      keysWithStatus?.filter(({ statuses }) =>
        statuses.includes(KEY_STATUS.EXIT_REQUESTED),
      ).length,
    [keysWithStatus],
  );

  const { data: keysWithWrongFeeRecipient } =
    useOperatorKeysWithWrongFeeRecipient(nodeOperatorId);

  const {
    isDismissed: isFeeRecipientAlertDismissed,
    dismiss: dismissFeeRecipientAlert,
  } = useDismiss(
    `alert-fee-recipient-dismissed-${nodeOperatorId}`,
    ALERT_FEE_RECIPIENT_DISMISS_HOURS,
  );

  useAlertWatcher({
    component: AlertUnsupportedChain,
    shouldShow: !isSupportedChain,
  });

  useAlertWatcher({
    component: AlertRequestToExit,
    shouldShow: !!hasRequestsToExit,
    loading: isKeysLoading,
  });

  useAlertWatcher({
    component: AlertNomalizeQueue,
    shouldShow: !isModuleCM && !!normalizeQueue,
  });

  useAlertWatcher({
    component: AlertLockedBond,
    shouldShow:
      !!balance?.locked && !isLockExpired && route !== PATH.BOND_UNLOCK,
  });

  useAlertWatcher({
    component: AlertExpiredLockedBond,
    shouldShow:
      !!balance?.locked && !!isLockExpired && route !== PATH.BOND_UNLOCK,
  });

  useAlertWatcher({
    component: AlertClaimIcs,
    shouldShow: canClaimICS && route !== PATH.TYPE_CLAIM,
  });

  useAlertWatcher({
    component: AlertWrongFeeRecipient,
    shouldShow:
      !!keysWithWrongFeeRecipient?.length && !isFeeRecipientAlertDismissed,
    props: useMemo(
      () => ({
        pubkeys: keysWithWrongFeeRecipient || [],
        onClose: () => {
          dismissFeeRecipientAlert();
          closeAlert(AlertWrongFeeRecipient);
        },
      }),
      [closeAlert, dismissFeeRecipientAlert, keysWithWrongFeeRecipient],
    ),
  });

  return <>{children}</>;
};
