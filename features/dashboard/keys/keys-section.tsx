import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { isModuleCM } from 'consts/module';
import { PATH } from 'consts/urls';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { FC, useCallback } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { hasStatus, StatusFilter } from 'utils';
import { Item } from './item';
import { KeysBreakdown } from './keys-breakdown/keys-breakdown';
import { Row } from './styles';

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus(id);

  const keysCountWithStatus = useCallback(
    (filter: StatusFilter) => keys?.filter(hasStatus(filter)).length,
    [keys],
  );

  return (
    <SectionBlock
      title={isModuleCM ? 'Stake and Keys' : 'Keys'}
      data-testid="dashboardKeysSection"
      href={PATH.KEYS_VIEW}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink}
    >
      <Stack direction="column" gap="sm">
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
          {/* <Item
            data-testid="keysExitedCount"
            title="Exited"
            count={keysCountWithStatus(KEY_STATUS.WITHDRAWAL_PENDING)}
            tooltip="Keys that have already exited but not withdrawn yet"
          /> */}
          <Item
            data-testid="keysWithdrawnCount"
            title="Withdrawn"
            count={keysCountWithStatus(KEY_STATUS.WITHDRAWN)}
            tooltip="Keys that have already exited and withdrawn"
          />
        </Row>
        <KeysBreakdown />
      </Stack>
    </SectionBlock>
  );
};
