import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import {
  CompareParametersList,
  type CompareParametersListItem,
} from 'shared/components';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

type ParameterChangesModalProps = {
  open: boolean;
  onClose: () => void;
  items: CompareParametersListItem[];
};

export const ParameterChangesModal: FC<ParameterChangesModalProps> = ({
  open,
  onClose,
  items,
}) => (
  <FormModalShell
    ui="app"
    open={open}
    onClose={onClose}
    title="Parameter changes"
    data-testid="parameterChangesModal"
  >
    <CompareParametersList module={MODULE_NAME.CSM} items={items} />
  </FormModalShell>
);
