import {
  KEY_STATUS,
  MODULE_NAME,
  NodeOperatorId,
  ValidatorInfoIssues,
} from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { useOperatorKeysWithStatus } from './use-operator-keys-with-status';
import { useOperatorKeysWithIssues } from './use-operator-keys-with-issues';

const ACTIVE_STATUSES = [KEY_STATUS.ACTIVE, KEY_STATUS.EXITING];

export const useOperatorKeysWithWrongFeeRecipient = ({
  nodeOperatorId,
  module,
}: {
  nodeOperatorId: NodeOperatorId | undefined;
  module?: MODULE_NAME;
}) => {
  const { data: keysWithStatus } = useOperatorKeysWithStatus({
    nodeOperatorId,
    module,
  });

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

  return useOperatorKeysWithIssues({
    nodeOperatorId,
    module,
    select: isActive,
  });
};
