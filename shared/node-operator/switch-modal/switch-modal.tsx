import { Button, Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import type { ModalComponentType } from 'providers/modal-provider';
import { useNodeOperator } from 'providers/node-operator-provider';
import { NodeOperatorId } from 'types';
import { Descriptor } from '../descriptor/descriptor';
import { ActionsStyle, ContentStyle, ListStyle, RowStyle } from './styles';

export const SwitchModal: ModalComponentType = ({ onClose, ...props }) => {
  const { active, list, switchActive } = useNodeOperator();

  const handleSwitch = useCallback(
    (id: NodeOperatorId) => {
      switchActive(id);
      onClose?.();
    },
    [switchActive, onClose],
  );

  return (
    <Modal title="Switch NodeOperator" onClose={onClose} {...props}>
      <ListStyle>
        {list.map((item) => (
          <RowStyle key={item.id.toString()}>
            <ContentStyle>
              <Descriptor roles={item} roleBackground="dark" />
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
    </Modal>
  );
};
