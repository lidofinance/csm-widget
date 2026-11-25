import { Modal, Spinner, Stack } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { useCallback, useMemo } from 'react';
import {
  CaptionStyle,
  CreateSection,
  filterCreateRows,
  OperatorRow,
  SectionStyle,
  useCreateRows,
} from '../operator-rows';
import s from './styles.module.css';

const CREATE_EVENTS = {
  cm: MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCm,
  csm: MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCsm,
};

export const ChooseOperatorModal: ModalComponentType = ({ onClose }) => {
  const {
    dismissSelection,
    switchNodeOperator,
    isDiscovering,
    selectionFilter,
  } = useNodeOperator();
  const { data: list } = useAvailableOperators();
  const allCreateRows = useCreateRows();
  const createRows = useMemo(
    () =>
      selectionFilter
        ? filterCreateRows(allCreateRows, selectionFilter)
        : allCreateRows,
    [allCreateRows, selectionFilter],
  );
  const operators = useMemo(
    () =>
      selectionFilter
        ? list?.filter((item) => selectionFilter.includes(item.module))
        : list,
    [list, selectionFilter],
  );

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
        <div className={s.loading}>
          <Spinner
            size="lg"
            label="Loading operators"
            data-testid="selectOperatorModalLoader"
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      withOverlay
      title="Choose a Node Operator"
      subtitle={
        createRows.hasRows
          ? 'Choose an existing operator to continue, or create a new one'
          : 'Choose an existing operator to continue'
      }
      onClose={handleClose}
      className={s.modal}
      data-testid="selectOperatorModal"
    >
      <Stack gap={32}>
        <SectionStyle>
          <CaptionStyle $size="regular">Your Node Operators</CaptionStyle>
          {operators?.map((item) => (
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
      </Stack>
    </Modal>
  );
};
