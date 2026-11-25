import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { isCsmFamilyModule } from 'consts';
import {
  useDappStatus,
  useFrameInfo,
  useIsLockExpired,
  useNodeOperator,
  useOperatorBalance,
  useOperatorKeysWithStatus,
  type OperatorRef,
} from 'modules/web3';
import { useOperatorKeysWithWrongFeeRecipient } from 'modules/web3/hooks';
import { FC, useEffect, useMemo } from 'react';
import {
  useCanClaimICSState,
  useCanClaimIDVTCState,
  useNeedsNormalizeState,
} from 'shared/hooks';
import { operatorKeyOf, toConditionState } from './condition-state';
import { getLatestFrameRange, selectStruckPubkeys } from './definitions/strike';
import { useNotificationsReporter } from './notifications-provider';
import type { ConditionState, OperatorReport } from './types';

const EMPTY_PROPS = {};

const claimIcsState = (
  ics: ConditionState,
  idvtc: ConditionState,
): ConditionState => {
  if (ics === 'unknown' || idvtc === 'unknown') return 'unknown';
  return ics === 'active' && idvtc === 'inactive' ? 'active' : 'inactive';
};

type Props = { operator: OperatorRef; address: string | undefined };

const OperatorAlertsWatcher: FC<Props> = ({ operator, address }) => {
  const { report, withdraw } = useNotificationsReporter();
  const { module, nodeOperatorId } = operator;
  const operatorKey = operatorKeyOf(operator);

  const keysQuery = useOperatorKeysWithStatus({ nodeOperatorId, module });
  const balanceQuery = useOperatorBalance({ nodeOperatorId, module });
  const lockExpiredQuery = useIsLockExpired({ nodeOperatorId, module });
  const frameQuery = useFrameInfo(undefined, module);
  const feeRecipientQuery = useOperatorKeysWithWrongFeeRecipient({
    nodeOperatorId,
    module,
  });
  const normalizeState = useNeedsNormalizeState();
  const icsState = useCanClaimICSState();
  const idvtcState = useCanClaimIDVTCState();

  const keys = keysQuery.data;
  const balance = balanceQuery.data;
  const isLockExpired = lockExpiredQuery.data;
  const info = frameQuery.data;
  const wrongFeeRecipient = feeRecipientQuery.data;

  // Joined so key refetches with the same struck set keep props stable
  const struckKey = selectStruckPubkeys(keys ?? []).join(',');
  const strikeProps = useMemo(
    () =>
      info && struckKey
        ? {
            pubkeys: struckKey.split(','),
            ...getLatestFrameRange(info),
            nextReport: info.lastReport + 2 * info.frameDuration,
          }
        : undefined,
    [info, struckKey],
  );

  const feeKey = keysQuery.isSuccess ? wrongFeeRecipient?.join(',') : undefined;
  const feeProps = useMemo(
    () =>
      feeKey === undefined
        ? undefined
        : { pubkeys: feeKey ? feeKey.split(',') : [] },
    [feeKey],
  );

  const lockQueries = [balanceQuery, lockExpiredQuery];
  const exitState = toConditionState({
    queries: [keysQuery],
    active: () =>
      !!keys?.some(({ statuses }) =>
        statuses.includes(KEY_STATUS.EXIT_REQUESTED),
      ),
  });
  const lockedState = toConditionState({
    queries: lockQueries,
    active: () => !!balance?.locked && !isLockExpired,
  });
  const expiredLockedState = toConditionState({
    queries: lockQueries,
    active: () => !!balance?.locked && !!isLockExpired,
  });
  const strikeState = toConditionState({
    gate: isCsmFamilyModule(module),
    queries: [keysQuery, frameQuery],
    active: () => !!strikeProps,
  });
  const feeState = toConditionState({
    // the issues select filters by key status, so it yields [] until keys load
    queries: [keysQuery, feeRecipientQuery],
    active: () => !!wrongFeeRecipient?.length,
  });
  const lastReport = info?.lastReport;

  // Rebuilt only when a state or props change, so the provider sees a stable report
  const operatorReport = useMemo<OperatorReport>(
    () => ({
      'exit-requested': { state: exitState, props: EMPTY_PROPS },
      'locked-bond': { state: lockedState, props: EMPTY_PROPS },
      'expired-locked-bond': { state: expiredLockedState, props: EMPTY_PROPS },
      'key-strike': {
        state: strikeState,
        instanceKey: lastReport === undefined ? undefined : String(lastReport),
        props: strikeProps,
      },
      'wrong-fee-recipient': { state: feeState, props: feeProps },
      'normalize-queue': { state: normalizeState, props: EMPTY_PROPS },
      'claim-ics': {
        state: claimIcsState(icsState, idvtcState),
        props: EMPTY_PROPS,
      },
      'claim-idvtc': { state: idvtcState, props: EMPTY_PROPS },
    }),
    [
      exitState,
      lockedState,
      expiredLockedState,
      strikeState,
      lastReport,
      strikeProps,
      feeState,
      feeProps,
      normalizeState,
      icsState,
      idvtcState,
    ],
  );

  useEffect(() => {
    report(operatorKey, operatorReport, address);
  }, [report, operatorKey, operatorReport, address]);

  useEffect(() => () => withdraw(operatorKey), [withdraw, operatorKey]);

  return null;
};

export const ActiveOperatorAlertsWatcher: FC = () => {
  const { nodeOperator } = useNodeOperator();
  const { address } = useDappStatus();
  if (!nodeOperator) return null;
  const operator = {
    module: nodeOperator.module,
    nodeOperatorId: nodeOperator.nodeOperatorId,
  };
  // Keyed by address too: the same operator under a new address must report afresh
  return (
    <OperatorAlertsWatcher
      key={`${address}:${operatorKeyOf(operator)}`}
      operator={operator}
      address={address}
    />
  );
};
