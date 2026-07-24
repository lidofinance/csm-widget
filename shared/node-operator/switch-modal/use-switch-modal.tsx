import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { getUseModal } from 'providers/modal-provider';
import { useCallback } from 'react';
import { useShowFlags } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { trackMatomoEvent } from 'utils';
import { SwitchModal } from './switch-modal';

export const useSwitchModal = getUseModal(SwitchModal);

export const useOpenOperatorSwitchModal = (path?: PATH) => {
  const { nodeOperator, switchNodeOperator } = useNodeOperator();
  const navigate = useNavigate();

  const handleSwitchOperator = useCallback(
    (id: NodeOperatorId) => {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator);
      switchNodeOperator(id);
      path && void navigate(path);
    },
    [navigate, path, switchNodeOperator],
  );

  const { openModal } = useSwitchModal();
  const { data: list } = useAvailableOperators();
  const { CAN_CREATE } = useShowFlags();

  return useCallback(() => {
    if (!nodeOperator || !list) return;
    openModal({
      active: nodeOperator,
      list,
      onChange: handleSwitchOperator,
      canCreate: CAN_CREATE,
    });
  }, [nodeOperator, list, openModal, handleSwitchOperator, CAN_CREATE]);
};
