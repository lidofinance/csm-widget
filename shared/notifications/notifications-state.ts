import type {
  Alert,
  AlertType,
  OperatorKey,
  OperatorReport,
  Reports,
  SessionClosed,
  Severity,
  StoredState,
} from './types';

const alertId = (
  operatorKey: OperatorKey,
  type: AlertType,
  instanceKey?: string,
) =>
  instanceKey === undefined
    ? `${operatorKey}:${type}`
    : `${operatorKey}:${type}:${instanceKey}`;

const matchesType = (id: string, base: string) =>
  id === base || id.startsWith(`${base}:`);

export const reconcile = (
  stored: StoredState,
  operatorKey: OperatorKey,
  report: OperatorReport,
  now: number,
): StoredState => {
  let next = stored;
  const mutable = () => {
    if (next === stored) next = { ...stored };
    return next;
  };

  for (const [type, r] of Object.entries(report)) {
    if (!r || r.state === 'unknown') continue;
    const base = `${operatorKey}:${type}`;
    const keep =
      r.state === 'active'
        ? alertId(operatorKey, type as AlertType, r.instanceKey)
        : undefined;

    for (const id of Object.keys(stored)) {
      if (matchesType(id, base) && id !== keep) delete mutable()[id];
    }
    if (keep !== undefined && !(keep in stored)) {
      mutable()[keep] = { firstSeenAt: now };
    }
  }
  return next;
};

export const closeToast = (
  stored: StoredState,
  sessionClosed: SessionClosed,
  alert: Alert,
  now: number,
): { stored: StoredState; sessionClosed: SessionClosed } => {
  if (alert.severity === 'normal') {
    const entry = stored[alert.id];
    if (!entry) return { stored, sessionClosed };
    return {
      stored: { ...stored, [alert.id]: { ...entry, toastClosedAt: now } },
      sessionClosed,
    };
  }
  return {
    stored,
    sessionClosed: { ...sessionClosed, [alert.id]: alert.firstSeenAt },
  };
};

export const acknowledge = (
  stored: StoredState,
  alert: Alert,
  ackedUntil: number,
): StoredState => {
  const entry = stored[alert.id];
  if (!entry) return stored;
  return { ...stored, [alert.id]: { ...entry, ackedUntil } };
};

export const selectVisible = (
  reports: Reports,
  stored: StoredState,
  now: number,
  severityOf: (type: AlertType) => Severity,
): Alert[] => {
  const alerts: Alert[] = [];
  for (const [operatorKey, report] of Object.entries(reports)) {
    for (const [type, r] of Object.entries(report)) {
      if (!r || r.state === 'inactive') continue;
      const id = alertId(operatorKey, type as AlertType, r.instanceKey);
      const entry = stored[id];
      if (!entry || r.props === undefined) continue;
      if (entry.ackedUntil !== undefined && entry.ackedUntil > now) continue;
      alerts.push({
        id,
        type: type as AlertType,
        operatorKey,
        severity: severityOf(type as AlertType),
        firstSeenAt: entry.firstSeenAt,
        props: r.props,
      });
    }
  }
  return alerts.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'important' ? -1 : 1;
    if (a.firstSeenAt !== b.firstSeenAt) return b.firstSeenAt - a.firstSeenAt;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
};

export const selectToastQueue = (
  visible: Alert[],
  stored: StoredState,
  sessionClosed: SessionClosed,
  route: string,
  suppressedOf: (type: AlertType) => string[] | undefined,
): Alert[] =>
  visible.filter((alert) => {
    if (suppressedOf(alert.type)?.includes(route)) return false;
    const entry = stored[alert.id];
    if (alert.severity === 'normal') return !entry?.toastClosedAt;
    return sessionClosed[alert.id] !== entry?.firstSeenAt;
  });

export const sliceToasts = (queue: Alert[], cap: number) => ({
  shown: queue.slice(0, cap),
  more: Math.max(0, queue.length - cap),
});

export const nextAckExpiry = (
  stored: StoredState,
  now: number,
): number | undefined => {
  let min: number | undefined;
  for (const { ackedUntil } of Object.values(stored)) {
    if (ackedUntil !== undefined && ackedUntil > now) {
      min = min === undefined ? ackedUntil : Math.min(min, ackedUntil);
    }
  }
  return min;
};
