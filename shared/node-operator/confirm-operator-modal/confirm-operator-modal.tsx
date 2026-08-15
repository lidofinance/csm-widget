import { Button, Modal, Text } from '@lidofinance/lido-ui';
import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import { DescriptorId } from '../descriptor/descriptor-id';

type ConfirmOperatorModalProps = ConfirmModalProps & {
  nodeOperator: NodeOperatorShortInfo;
};

export const ConfirmOperatorModal: ModalComponentType<
  ConfirmOperatorModalProps
> = ({ nodeOperator, onConfirm, onReject, ...props }) => {
  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Confirm your Node Operator
          </Text>
          <Text size="xs" color="secondary">
            You have multiple Node Operators. Check that the one below is the
            one you intend to use before proceeding.
          </Text>
        </Stack>

        <DescriptorId id={nodeOperator.nodeOperatorId} />

        <Button fullwidth onClick={onConfirm}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
