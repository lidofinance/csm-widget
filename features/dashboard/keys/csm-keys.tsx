import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { FC, useCallback } from 'react';
import { hasStatus, StatusFilter } from 'utils';
import { Item } from './item';
import { Row } from './styles';

export const CsmKeys: FC = () => {
  const id = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus(id);

  const keysCountWithStatus = useCallback(
    (filter: StatusFilter) => keys?.filter(hasStatus(filter)).length,
    [keys],
  );

  return (
    <Row>
      <Item
        data-testid="keysDepositableCount"
        title="Depositable"
        count={keysCountWithStatus(KEY_STATUS.DEPOSITABLE)}
        tooltip="Keys awaiting deposit from the Lido protocol"
      />
      <Item
        data-testid="keysPendingActivationCount"
        title="Pending activation"
        count={keysCountWithStatus(KEY_STATUS.ACTIVATION_PENDING)}
        tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
      />
      <Item
        data-testid="keysActiveCount"
        title="Active"
        count={keysCountWithStatus([KEY_STATUS.ACTIVE, KEY_STATUS.EXITING])}
        tooltip="Keys that active"
      />
      <Item
        data-testid="keysWithdrawnCount"
        title="Withdrawn"
        count={keysCountWithStatus([
          KEY_STATUS.WITHDRAWN,
          KEY_STATUS.WITHDRAWAL_PENDING,
        ])}
        tooltip="Keys that have already exited and withdrawn"
      />
    </Row>
  );
};
