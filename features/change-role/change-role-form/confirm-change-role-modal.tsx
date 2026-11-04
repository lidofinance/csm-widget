import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType, ModalProps } from 'providers/modal-provider';
import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import {
  getConfirmChangeRoleStepCopy,
  getConfirmChangeRoleSteps,
} from './change-role-state';
import { ConfirmChangeRoleModalApp } from './confirm-change-role-modal-app';

type Props = {
  showRewards: boolean;
  isProposal: boolean;
  showRepropose: boolean;
};

type ConfirmChangeRoleModalProps = ConfirmModalProps & Props;

const ConfirmChangeRoleModalLegacy: FC<
  ModalProps<Omit<ConfirmChangeRoleModalProps, 'ui'>>
> = ({
  showRewards,
  isProposal,
  showRepropose,
  onConfirm,
  onReject,
  ...props
}) => {
  const steps = useMemo(
    () => getConfirmChangeRoleSteps({ showRewards, showRepropose }),
    [showRewards, showRepropose],
  );

  const [index, setIndex] = useState(0);
  const isLast = index >= steps.length - 1;
  const copy = getConfirmChangeRoleStepCopy(steps[index], isProposal);

  const onContinue = useCallback(() => {
    if (isLast) onConfirm();
    else setIndex((i) => i + 1);
  }, [isLast, onConfirm]);

  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            {copy.title}
          </Text>
          <Text size="xs" color="secondary">
            {copy.body}
          </Text>
        </Stack>

        <Stack direction="column" gap="sm">
          <Button fullwidth onClick={onContinue}>
            Continue
          </Button>
          {copy.hint && (
            <Text size="xxs" color="secondary">
              {copy.hint}
            </Text>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};

export const ConfirmChangeRoleModal: ModalComponentType<
  ConfirmChangeRoleModalProps
> = ({ ui, ...props }) => {
  if (ui === 'app') {
    return (
      <ConfirmChangeRoleModalApp
        open={props.open}
        showRewards={props.showRewards}
        isProposal={props.isProposal}
        showRepropose={props.showRepropose}
        onConfirm={props.onConfirm}
        onReject={props.onReject}
      />
    );
  }

  return <ConfirmChangeRoleModalLegacy {...props} />;
};
