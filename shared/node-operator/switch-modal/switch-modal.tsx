import { Button, Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import {
  NodeOperatorId,
  NodeOperatorShortInfo,
  ROLES,
} from '@lidofinance/lido-csm-sdk';
import type { ModalComponentType } from 'providers/modal-provider';
import { Descriptor } from '../descriptor/descriptor';
import { RoleBadge } from '../role-badge/role-badge';
import {
  ActionsStyle,
  ContentStyle,
  ListStyle,
  RowStyle,
  StyledStack,
  StyledStackItem,
} from './styles';

export const SwitchModal: ModalComponentType<{
  active: NodeOperatorShortInfo;
  list: NodeOperatorShortInfo[];
  onChange: (id: NodeOperatorId) => void;
}> = ({ onClose, active, list, onChange, ...props }) => {
  const handleSwitch = useCallback(
    (id: NodeOperatorId) => {
      onChange(id);
      onClose?.();
    },
    [onChange, onClose],
  );

  return (
    <Modal title="Switch Node Operator" onClose={onClose} {...props}>
      <ListStyle>
        {list.map((item) => (
          <RowStyle key={item.nodeOperatorId.toString()}>
            <ContentStyle>
              <Descriptor nodeOperator={item} />
            </ContentStyle>
            <ActionsStyle>
              {active?.nodeOperatorId === item.nodeOperatorId ? (
                <Button size="xs" variant="ghost" disabled>
                  Current
                </Button>
              ) : (
                <Button
                  size="xs"
                  variant="outlined"
                  onClick={() => handleSwitch(item.nodeOperatorId)}
                >
                  Switch
                </Button>
              )}
            </ActionsStyle>
          </RowStyle>
        ))}
      </ListStyle>
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
