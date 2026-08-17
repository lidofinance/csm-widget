import { Modal, Text } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import {
  NodeOperatorId,
  NodeOperatorShortInfo,
  ROLES,
} from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { useDisconnectWallet } from 'shared/wallet';
import { trackMatomoEvent } from 'utils';
import { RoleBadge } from '../role-badge/role-badge';
import { OperatorRow } from './operator-row';
import { StyledStack, StyledStackItem } from './styles';

export const SelectModal: ModalComponentType<{
  list: NodeOperatorShortInfo[];
  onChange: (id: NodeOperatorId) => void;
}> = ({ onClose, list, onChange, ...props }) => {
  const disconnect = useDisconnectWallet();

  // mandatory selection: the cross/ESC/backdrop close is the only escape, so it disconnects
  const handleClose = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.disconnectWallet);
    disconnect();
    onClose?.();
  }, [disconnect, onClose]);

  return (
    <Modal title="Select Node Operator" onClose={handleClose} {...props}>
      <Stack direction="column" gap="lg">
        <Text size="xs" color="secondary">
          Your wallet manages several Node Operators. Choose the one to work
          with.
        </Text>
        <Stack direction="column" gap="sm">
          {list.map((item) => (
            <OperatorRow
              key={String(item.nodeOperatorId)}
              nodeOperatorId={item.nodeOperatorId}
              shortInfo={item}
              action="select"
              onSwitch={onChange}
            />
          ))}
        </Stack>
      </Stack>
      <StyledStack>
        <StyledStackItem>
          <RoleBadge role={ROLES.REWARDS} /> Rewards Address role
        </StyledStackItem>
        <StyledStackItem>
          <RoleBadge role={ROLES.MANAGER} /> Manager Address role
        </StyledStackItem>
      </StyledStack>
    </Modal>
  );
};
