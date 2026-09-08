import { ButtonIcon, Modal } from '@lidofinance/lido-ui';
import { useCallback } from 'react';

import { ROLES } from '@lidofinance/lido-csm-sdk';
import { Plus } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { OperatorRef, useModule } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { RoleBadge } from '../role-badge/role-badge';
import { CmSwitchList } from './cm-switch-list';
import { OperatorRow } from './operator-row';
import { StyledStack, StyledStackItem } from './styles';

export const SwitchModal: ModalComponentType<{
  active: ModuleNodeOperator;
  list: ModuleNodeOperator[];
  canCreate: boolean;
  onChange: (operator: OperatorRef) => void;
}> = ({ onClose, active, list, onChange, canCreate, ...props }) => {
  const { isCM } = useModule();
  const handleSwitch = useCallback(
    (operator: OperatorRef) => {
      onChange(operator);
      onClose?.();
    },
    [onChange, onClose],
  );

  return (
    <Modal title="Switch Node Operator" onClose={onClose} {...props}>
      <Stack direction="column" gap="lg">
        {isCM ? (
          <CmSwitchList active={active} list={list} onSwitch={handleSwitch} />
        ) : (
          <Stack direction="column" gap="sm">
            {list.map((item) => (
              <OperatorRow
                key={`${String(item.nodeOperatorId)}-${item.module}`}
                nodeOperatorId={item.nodeOperatorId}
                shortInfo={item}
                action={
                  item.nodeOperatorId === active.nodeOperatorId &&
                  item.module === active.module
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
