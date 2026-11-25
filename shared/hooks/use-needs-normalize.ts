import { useModule, useNodeOperatorId } from 'modules/web3';
import { useOperatorInfo } from 'modules/web3/hooks/use-operator-info';
import { toConditionState } from 'shared/notifications/condition-state';
import type { ConditionState } from 'shared/notifications/types';

export const useNeedsNormalizeState = (): ConditionState => {
  const { isCsmFamily } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const infoQuery = useOperatorInfo({ nodeOperatorId });

  return toConditionState({
    gate: isCsmFamily,
    queries: [infoQuery],
    active: () =>
      !!infoQuery.data &&
      infoQuery.data.enqueuedCount < infoQuery.data.depositableValidatorsCount,
  });
};

export const useNeedsNormalize = (): boolean =>
  useNeedsNormalizeState() === 'active';
