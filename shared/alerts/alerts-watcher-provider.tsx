import { KEY_STATUS, ROLES } from '@lidofinance/lido-csm-sdk';
import { ALERT_FEE_RECIPIENT_DISMISS_HOURS, PATH } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useWrappedApi } from 'features/wrapped/data';
import {
  useNodeOperator,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import {
  useDappStatus,
  useOperatorKeysWithWrongFeeRecipient,
} from 'modules/web3/hooks';
import { useOperatorKeysToMigrate } from 'modules/web3/hooks/use-operator-keys-to-migrate';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useMemo } from 'react';
import { useCanClaimICS, useDismiss } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { useAlertActions } from './alert-provider';
import { AlertClaimIcs } from './components/alert-claim-ics';
import { AlertLockedBond } from './components/alert-locked-bond';
import { AlertNomalizeQueue } from './components/alert-normalize-queue';
import { AlertRequestToExit } from './components/alert-request-to-exit';
import { AlertTransferKeys } from './components/alert-transfer-keys';
import { AlertUnsupportedChain } from './components/alert-unsupported-chain';
import { AlertWrapped } from './components/alert-wrapped';
import { AlertWrongFeeRecipient } from './components/alert-wrong-fee-recipient';
import { useAlertWatcher } from './use-alert-watcher';

export const AlertsWatcherProvider: FC<PropsWithChildren> = ({ children }) => {
  const { closeAlert } = useAlertActions();

  const { isSupportedChain } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: info } = useOperatorInfo(nodeOperator?.id);
  const { data: keysToTransfer } = useOperatorKeysToMigrate(nodeOperator?.id);
  const canClaimICS = useCanClaimICS();
  const { route } = useRouter();
  const { data: wrappedData } = useWrappedApi(nodeOperator?.id);

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

  const { data: keysWithWrongFeeRecipient } =
    useOperatorKeysWithWrongFeeRecipient(nodeOperator?.id);

  const {
    isDismissed: isFeeRecipientAlertDismissed,
    dismiss: dismissFeeRecipientAlert,
  } = useDismiss(
    `alert-fee-recipient-dismissed-${nodeOperator?.id}`,
    ALERT_FEE_RECIPIENT_DISMISS_HOURS,
  );

  const { isDismissed: isWrappedAlertDismissed, dismiss: dismissWrappedAlert } =
    useDismiss(
      `alert-wrapped-dismissed-${nodeOperator?.id}`,
      7200, // approx 10 months in hours
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
    shouldShow: !!normalizeQueue,
  });

  useAlertWatcher({
    component: AlertTransferKeys,
    shouldShow: !!keysToTransfer,
  });

  useAlertWatcher({
    component: AlertLockedBond,
    shouldShow: !!balance?.locked,
  });

  useAlertWatcher({
    component: AlertClaimIcs,
    shouldShow: canClaimICS && route !== PATH.TYPE_CLAIM,
  });

  useAlertWatcher({
    component: AlertWrapped,
    shouldShow:
      !!nodeOperator &&
      route !== PATH.WRAPPED &&
      !isWrappedAlertDismissed &&
      !!wrappedData,
    props: useMemo(
      () => ({
        onClose: () => {
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedAlertClose);
          dismissWrappedAlert();
          closeAlert(AlertWrapped);
        },
        onLinkClick: () => {
          dismissWrappedAlert();
          closeAlert(AlertWrapped);
        },
      }),
      [closeAlert, dismissWrappedAlert],
    ),
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
