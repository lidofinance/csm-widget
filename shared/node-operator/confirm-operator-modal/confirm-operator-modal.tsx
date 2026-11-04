import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import type { ModalComponentType } from 'providers/modal-provider';
import { ConfirmModalProps } from 'shared/hooks';
import { ConfirmOperatorModalApp } from './confirm-operator-modal-app';

type ConfirmOperatorModalProps = ConfirmModalProps & {
  nodeOperator: NodeOperatorShortInfo;
};

export const ConfirmOperatorModal: ModalComponentType<
  ConfirmOperatorModalProps
> = ({ open, nodeOperator, onConfirm, onReject }) => (
  <ConfirmOperatorModalApp
    open={open}
    nodeOperator={nodeOperator}
    onConfirm={onConfirm}
    onReject={onReject}
  />
);
