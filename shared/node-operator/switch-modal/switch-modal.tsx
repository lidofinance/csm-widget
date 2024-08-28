import { Button, Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import { ROLES } from 'consts/roles';
import type { ModalComponentType } from 'providers/modal-provider';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { NodeOperatorId } from 'types';
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

export const SwitchModal: ModalComponentType = ({ onClose, ...props }) => {
  const { active, list, switchActive } = useNodeOperatorContext();

  const handleSwitch = useCallback(
    (id: NodeOperatorId) => {
      switchActive(id);
      onClose?.();
    },
    [switchActive, onClose],
  );

  return (
    <Modal title="Switch Node Operator" onClose={onClose} {...props}>
      <ListStyle>
        {list.map((item) => (
          <RowStyle key={item.id.toString()}>
            <ContentStyle>
              <Descriptor nodeOperator={item} />
            </ContentStyle>
            <ActionsStyle>
              {active?.id === item.id ? (
                <Button size="xs" variant="ghost" disabled>
                  Current
                </Button>
              ) : (
                <Button
                  size="xs"
                  variant="outlined"
                  onClick={() => handleSwitch(item.id)}
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
          <RoleBadge role={ROLES.REWARDS} /> Rewards address role
        </StyledStackItem>
        <StyledStackItem>
          <RoleBadge role={ROLES.MANAGER} /> Manager address role
        </StyledStackItem>
      </StyledStack>
    </Modal>
  );
};
