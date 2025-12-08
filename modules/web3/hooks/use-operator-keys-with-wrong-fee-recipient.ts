import {
  KEY_STATUS,
  NodeOperatorId,
  ValidatorInfoIssues,
} from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { useOperatorKeysWithStatus } from './use-operator-keys-with-status';
import { useOperatorKeysWithIssues } from './use-operator-keys-with-issues';

const ACTIVE_STATUSES = [
  KEY_STATUS.DEPOSITABLE,
  KEY_STATUS.ACTIVATION_PENDING,
  KEY_STATUS.ACTIVE,
  KEY_STATUS.EXITING,
  KEY_STATUS.WITHDRAWAL_PENDING,
];

export const useOperatorKeysWithWrongFeeRecipient = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { data: keysWithStatus } = useOperatorKeysWithStatus(nodeOperatorId);

  const isActive = useCallback(
    (data: ValidatorInfoIssues[]) =>
      data
        .filter((issue) => issue.status === 'InvalidFeeRecipient')
        .filter(
          (issue) =>
            keysWithStatus
              ?.find((key) => key.pubkey === issue.pubkey)
              ?.statuses.some((status) => ACTIVE_STATUSES.includes(status)) ??
            false,
        )
        .map((issue) => issue.pubkey),
    [keysWithStatus],
  );

  return useOperatorKeysWithIssues(nodeOperatorId, isActive);
};
