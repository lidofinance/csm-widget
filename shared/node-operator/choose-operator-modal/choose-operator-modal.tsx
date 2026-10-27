import { Modal } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { useCallback } from 'react';
import { useDisconnectWallet } from 'shared/wallet';
import { trackMatomoEvent } from 'utils';
import { CreateSection } from './create-rows';
import { OperatorRow } from './operator-row';
import { CaptionStyle, ContentStyle, SectionStyle } from './styles';

export const ChooseOperatorModal: ModalComponentType = ({ onClose }) => {
  const disconnect = useDisconnectWallet();
  const { dismissSelection, switchNodeOperator } = useNodeOperator();
  const { data: list } = useAvailableOperators();

  // mandatory selection: the cross/ESC/backdrop close is the only escape, so it disconnects
  const handleClose = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.disconnectWallet);
    disconnect();
    onClose?.();
  }, [disconnect, onClose]);

  return (
    <Modal
      withOverlay
      title="Choose a Node Operator"
      subtitle="Choose an existing operator to continue, or create a new one"
      onClose={handleClose}
      data-testid="selectOperatorModal"
    >
      <ContentStyle>
        <SectionStyle>
          <CaptionStyle>Your Node Operators</CaptionStyle>
          {list?.map((item) => (
            <OperatorRow
              key={`${String(item.nodeOperatorId)}-${item.module}`}
              operator={item}
              onSelect={switchNodeOperator}
            />
          ))}
        </SectionStyle>
        <CreateSection onCreate={dismissSelection} />
      </ContentStyle>
    </Modal>
  );
};
