import { useDappStatus } from 'modules/web3';
import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage, useSessionStorage } from 'shared/hooks';
import { ALERT_DEFINITIONS, severityOf, suppressedOf } from './definitions';
import {
  acknowledge as acknowledgeState,
  closeToast as closeToastState,
  nextAckExpiry,
  reconcile,
  selectToastQueue,
  selectVisible,
} from './notifications-state';
import type {
  Alert,
  OperatorKey,
  OperatorReport,
  Reports,
  SessionClosed,
  StoredState,
} from './types';

type NotificationsReporter = {
  report: (
    operatorKey: OperatorKey,
    report: OperatorReport,
    address: string | undefined,
  ) => void;
  withdraw: (operatorKey: OperatorKey) => void;
};

type NotificationsValue = {
  alerts: Alert[];
  count: number;
  toastQueue: Alert[];
  closeToast: (alert: Alert) => void;
  acknowledge: (alert: Alert) => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const NOOP_REPORTER: NotificationsReporter = {
  report: () => undefined,
  withdraw: () => undefined,
};

type TaggedReport = { report: OperatorReport; address: string | undefined };

const EMPTY_STORED: StoredState = {};
const EMPTY_SESSION: SessionClosed = {};
const MAX_TIMEOUT = 2 ** 31 - 1;

const NotificationsReporterContext =
  createContext<NotificationsReporter>(NOOP_REPORTER);

export const useNotificationsReporter = () =>
  useContext(NotificationsReporterContext);

export const NotificationsValueContext =
  createContext<NotificationsValue | null>(null);

export const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useDappStatus();
  const { route } = useRouter();
  const lower = address?.toLowerCase();

  const [stored, setStored] = useLocalStorage<StoredState>(
    lower ? `notifications-${lower}` : undefined,
    EMPTY_STORED,
  );
  const [sessionClosed, setSessionClosed] = useSessionStorage<SessionClosed>(
    lower ? `notifications-session-${lower}` : undefined,
    EMPTY_SESSION,
  );

  const [tagged, setTagged] = useState<Record<OperatorKey, TaggedReport>>({});
  const [now, setNow] = useState(Date.now);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const report = useCallback<NotificationsReporter['report']>(
    (key, r, reportAddress) => {
      const from = reportAddress?.toLowerCase();
      setTagged((prev) =>
        prev[key]?.report === r && prev[key].address === from
          ? prev
          : { ...prev, [key]: { report: r, address: from } },
      );
    },
    [],
  );

  const withdraw = useCallback<NotificationsReporter['withdraw']>((key) => {
    setTagged((prev) => {
      if (!(key in prev)) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // After an address switch the previous operator's watcher may still be mounted for a render
  const reports = useMemo<Reports>(
    () =>
      Object.fromEntries(
        Object.entries(tagged)
          .filter(([, t]) => t.address === lower)
          .map(([k, t]) => [k, t.report]),
      ),
    [tagged, lower],
  );

  const reporter = useMemo(() => ({ report, withdraw }), [report, withdraw]);

  useEffect(() => {
    if (!lower) return;
    const at = Date.now();
    const next = Object.entries(reports).reduce(
      (s, [k, r]) => reconcile(s, k, r, at),
      stored,
    );
    if (next !== stored) setStored(next);
  }, [lower, reports, stored, setStored]);

  useEffect(() => {
    const at = nextAckExpiry(stored, Date.now());
    if (at === undefined) return;
    const t = setTimeout(
      () => setNow(Date.now()),
      Math.min(at - Date.now() + 50, MAX_TIMEOUT),
    );
    return () => clearTimeout(t);
  }, [stored, now]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [lower]);

  const alerts = useMemo(
    () => (lower ? selectVisible(reports, stored, now, severityOf) : []),
    [lower, reports, stored, now],
  );

  const toastQueue = useMemo(
    () => selectToastQueue(alerts, stored, sessionClosed, route, suppressedOf),
    [alerts, stored, sessionClosed, route],
  );

  const closeToast = useCallback(
    (alert: Alert) => {
      const next = closeToastState(stored, sessionClosed, alert, Date.now());
      if (next.stored !== stored) setStored(next.stored);
      if (next.sessionClosed !== sessionClosed) {
        setSessionClosed(next.sessionClosed);
      }
    },
    [stored, sessionClosed, setStored, setSessionClosed],
  );

  const acknowledge = useCallback(
    (alert: Alert) => {
      const ackUntil = ALERT_DEFINITIONS[alert.type].ackUntil;
      if (!ackUntil) return;
      const next = acknowledgeState(
        stored,
        alert,
        ackUntil(alert.props, Date.now()),
      );
      if (next !== stored) setStored(next);
      setNow(Date.now());
    },
    [stored, setStored],
  );

  const value = useMemo<NotificationsValue>(
    () => ({
      alerts,
      count: alerts.length,
      toastQueue,
      closeToast,
      acknowledge,
      isDrawerOpen,
      setDrawerOpen,
    }),
    [alerts, toastQueue, closeToast, acknowledge, isDrawerOpen],
  );

  return (
    <NotificationsReporterContext.Provider value={reporter}>
      <NotificationsValueContext.Provider value={value}>
        {children}
      </NotificationsValueContext.Provider>
    </NotificationsReporterContext.Provider>
  );
};
