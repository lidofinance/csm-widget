import type { FC } from 'react';
import type { PATH } from 'consts/urls';

export type AlertType =
  | 'exit-requested'
  | 'locked-bond'
  | 'expired-locked-bond'
  | 'key-strike'
  | 'wrong-fee-recipient'
  | 'normalize-queue'
  | 'claim-ics'
  | 'claim-idvtc';
export type Severity = 'important' | 'normal';
export type ConditionState = 'active' | 'inactive' | 'unknown';

/** `${module}-${nodeOperatorId}`, e.g. `CSM-12` */
export type OperatorKey = string;

export type ConditionReport<P = unknown> = {
  state: ConditionState;
  instanceKey?: string;
  /** Present whenever the inputs have data, even if the state is `unknown` (refetch error) */
  props?: P;
};
export type OperatorReport = Partial<Record<AlertType, ConditionReport>>;
export type Reports = Record<OperatorKey, OperatorReport>;

export type StoredAlert = {
  firstSeenAt: number;
  toastClosedAt?: number;
  ackedUntil?: number;
};
export type StoredState = Record<string, StoredAlert>;
/** alert id → firstSeenAt of the occurrence whose toast was closed */
export type SessionClosed = Record<string, number>;

export type Alert = {
  id: string;
  type: AlertType;
  operatorKey: OperatorKey;
  severity: Severity;
  firstSeenAt: number;
  props: unknown;
};

export type AlertActionsProps = {
  isActiveOperator: boolean;
  onNavigate: () => void;
};

export type AlertDefinition<P = Record<string, never>> = {
  severity: Severity;
  title: string;
  Body: FC<P>;
  Actions: FC<P & AlertActionsProps>;
  /** Present only on acknowledgeable types; returns an epoch-ms timestamp */
  ackUntil?: (props: P, now: number) => number;
  dismissLabel?: string;
  onDismissTrack?: () => void;
  suppressedRoutes?: PATH[];
  testId?: string;
};
