import { BodyLarge, Button, Stack } from '@lidofinance/lido-app-ui';
import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import { DescriptorId } from '../descriptor/descriptor-id';

type ConfirmOperatorModalAppProps = ConfirmModalProps & {
  open?: boolean;
  nodeOperator: NodeOperatorShortInfo;
};

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
      <BodyLarge>
        <DescriptorId id={nodeOperator.nodeOperatorId} />
      </BodyLarge>
      <Button onClick={onConfirm} data-testid="confirmOperatorButton">
        Continue
      </Button>
    </Stack>
  </FormModalShell>
);
