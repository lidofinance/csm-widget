import { Button, Stack } from '@lidofinance/lido-app-ui';
import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import styled from 'styled-components';
import { DescriptorId } from '../descriptor/descriptor-id';

type ConfirmOperatorModalAppProps = ConfirmModalProps & {
  open?: boolean;
  nodeOperator: NodeOperatorShortInfo;
};

const OperatorStyle = styled.div`
  color: var(--lido-app-ui-color-text-default);
  font-size: var(--lido-app-ui-font-size-body);
  line-height: var(--lido-app-ui-line-height-body);
`;

export const ConfirmOperatorModalApp: FC<ConfirmOperatorModalAppProps> = ({
  open,
  nodeOperator,
  onConfirm,
  onReject,
}) => (
  <FormModalShell
    ui="app"
    open={open}
    onClose={onReject}
    title="Confirm your Node Operator"
    subtitle="Check that the Node Operator below is the one you intend to use before proceeding"
    data-testid="confirmOperatorModal"
  >
    <Stack direction="column" gap={24}>
      <OperatorStyle>
        <DescriptorId id={nodeOperator.nodeOperatorId} />
      </OperatorStyle>
      <Button onClick={onConfirm} data-testid="confirmOperatorButton">
        Continue
      </Button>
    </Stack>
  </FormModalShell>
);
