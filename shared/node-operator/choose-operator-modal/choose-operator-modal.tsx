import { Modal } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { useCallback } from 'react';
import {
  CaptionStyle,
  CreateSection,
  OperatorRow,
  SectionStyle,
  useCreateRows,
} from '../operator-rows';
import { ContentStyle, LoadingStyle, SpinnerStyle } from './styles';

const CREATE_EVENTS = {
  cm: MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCm,
  csm: MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCsm,
};

export const ChooseOperatorModal: ModalComponentType = ({ onClose }) => {
  const { dismissSelection, switchNodeOperator, isDiscovering } =
    useNodeOperator();
  const { data: list } = useAvailableOperators();
  const createRows = useCreateRows();

  const handleClose = useCallback(() => {
    dismissSelection();
    onClose?.();
  }, [dismissSelection, onClose]);

  if (isDiscovering) {
    return (
      <Modal
        withOverlay
        title="Choose a Node Operator"
        data-testid="selectOperatorModal"
      >
        <LoadingStyle>
          <SpinnerStyle data-testid="selectOperatorModalLoader" />
        </LoadingStyle>
      </Modal>
    );
  }

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
          <CaptionStyle $size="regular">Your Node Operators</CaptionStyle>
          {list?.map((item) => (
            <OperatorRow
              key={`${String(item.nodeOperatorId)}-${item.module}`}
              operator={item}
              size="regular"
              onSelect={switchNodeOperator}
              data-testid="selectModalOperatorRow"
              data-name-testid="selectModalOperatorName"
            />
          ))}
        </SectionStyle>
        <CreateSection
          size="regular"
          rows={createRows}
          onCreate={dismissSelection}
          events={CREATE_EVENTS}
          testIdPrefix="selectModalCreate"
        />
      </ContentStyle>
    </Modal>
  );
};
