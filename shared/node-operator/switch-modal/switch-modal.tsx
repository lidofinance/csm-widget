import { Button, Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import { ROLES } from 'consts/roles';
import type { ModalComponentType } from 'providers/modal-provider';
import { CURVE_TYPE } from 'shared/hooks';
import { NodeOperator, NodeOperatorId } from 'types';
import { CurveBadge } from '../curve-badge/curve-badge';
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
  active: NodeOperator;
  list: NodeOperator[];
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
          <RoleBadge role={ROLES.REWARDS} /> Rewards Address role
        </StyledStackItem>
        <StyledStackItem>
          <RoleBadge role={ROLES.MANAGER} /> Manager Address role
        </StyledStackItem>
        <StyledStackItem>
          <CurveBadge type={CURVE_TYPE.EA} /> Early Adopter
        </StyledStackItem>
        {/* <StyledStackItem>
          <CurveBadge type={CURVE_TYPE.CUSTOM} /> Custom Curve
        </StyledStackItem> */}
      </StyledStack>
    </Modal>
  );
};
