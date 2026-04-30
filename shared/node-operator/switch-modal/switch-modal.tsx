import { ButtonIcon, Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import {
  NodeOperatorId,
  NodeOperatorShortInfo,
  ROLES,
} from '@lidofinance/lido-csm-sdk';
import { Plus } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { isModuleCM } from 'consts/module';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { RoleBadge } from '../role-badge/role-badge';
import { CmSwitchList } from './cm-switch-list';
import { OperatorRow } from './operator-row';
import { StyledStack, StyledStackItem } from './styles';

export const SwitchModal: ModalComponentType<{
  active: NodeOperatorShortInfo;
  list: NodeOperatorShortInfo[];
  canCreate: boolean;
  onChange: (id: NodeOperatorId) => void;
}> = ({ onClose, active, list, onChange, canCreate, ...props }) => {
  const handleSwitch = useCallback(
    (id: NodeOperatorId) => {
      onChange(id);
      onClose?.();
    },
    [onChange, onClose],
  );

  return (
    <Modal title="Switch Node Operator" onClose={onClose} {...props}>
      <Stack direction="column" gap="lg">
        {isModuleCM ? (
          <CmSwitchList active={active} list={list} onSwitch={handleSwitch} />
        ) : (
          <Stack direction="column" gap="sm">
            {list.map((item) => (
              <OperatorRow
                key={String(item.nodeOperatorId)}
                nodeOperatorId={item.nodeOperatorId}
                shortInfo={item}
                action={
                  item.nodeOperatorId === active.nodeOperatorId
                    ? 'current'
                    : 'switch'
                }
                onSwitch={handleSwitch}
              />
            ))}
          </Stack>
        )}
        {canCreate && (
          <LocalLink href={PATH.CREATE}>
            <ButtonIcon icon={<Plus />} fullwidth size="sm" variant="outlined">
              Create a new Node Operator
            </ButtonIcon>
          </LocalLink>
        )}
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
