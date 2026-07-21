import {
  ArrowBottom,
  Button,
  Checkbox,
  Modal,
  Text,
} from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { useState } from 'react';
import { Stack } from 'shared/components';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';
import { ConfirmationList } from '../../shared';
import { LabeledAddressBox } from '../controls/labeled-address-box';

type ConfirmRotationModalProps = {
  currentAddress: string;
  newAddress: string;
};

const ConfirmRotationModal: ModalComponentType<
  ConfirmModalProps & ConfirmRotationModalProps
> = ({ currentAddress, newAddress, onConfirm, onReject, ...props }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Modal
      {...props}
      onClose={onReject}
      title={
        <Stack direction="column" gap="xxs">
          <Text as="h5" size="sm" weight={700}>
            You are submitting cluster member rotation
          </Text>
          <Text size="xxs" color="secondary">
            Please review the changes below before confirming
          </Text>
        </Stack>
      }
    >
      <Stack direction="column" gap="xl" data-testid="confirmRotationModal">
        <Stack direction="column" gap="xs">
          <LabeledAddressBox
            label="Current member address"
            address={currentAddress}
          />
          <Stack justify="center">
            <ArrowBottom color="var(--lido-color-textSecondary)" />
          </Stack>
          <LabeledAddressBox
            label="New cluster member address"
            address={newAddress}
          />
        </Stack>

        <Stack align="start" gap="sm">
          <Checkbox
            checked={confirmed}
            onChange={() => setConfirmed((v) => !v)}
            data-testid="confirmRotationCheckbox"
          />
          <Text size="xxs" color="secondary" as="div">
            New participant confirms that:
            <ConfirmationList>
              <li>They understand the requirements and eligibility criteria</li>
              <li>
                They agree to enroll in monitoring via DVT provider specific
                tooling (e.g. Obol Grafana metrics or automatic SSV Network
                metrics)
              </li>
            </ConfirmationList>
          </Text>
        </Stack>

        <Button
          fullwidth
          disabled={!confirmed}
          onClick={onConfirm}
          data-testid="submitRotationRequestButton"
        >
          Submit rotation request
        </Button>
      </Stack>
    </Modal>
  );
};

export const useConfirmRotationModal = getUseConfirmModal(ConfirmRotationModal);
