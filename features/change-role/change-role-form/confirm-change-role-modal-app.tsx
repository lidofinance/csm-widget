import { Button, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, useCallback, useMemo, useState } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import {
  getConfirmChangeRoleStepCopy,
  getConfirmChangeRoleSteps,
} from './change-role-state';

type ConfirmChangeRoleModalAppProps = ConfirmModalProps & {
  open?: boolean;
  showRewards: boolean;
  isProposal: boolean;
  showRepropose: boolean;
};

export const ConfirmChangeRoleModalApp: FC<ConfirmChangeRoleModalAppProps> = ({
  open,
  showRewards,
  isProposal,
  showRepropose,
  onConfirm,
  onReject,
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
    else setIndex((current) => current + 1);
  }, [isLast, onConfirm]);

  return (
    <FormModalShell
      open={open}
      onClose={onReject}
      title={copy.title}
      subtitle={copy.body}
      dataTestId={{
        root: 'confirmChangeRoleModal',
        title: 'changeRoleModalTitle',
        subtitle: 'changeRoleModalText',
      }}
    >
      <Stack direction="column" gap={12}>
        <Button fullWidth onClick={onContinue}>
          Continue
        </Button>
        {copy.hint && (
          <Typography
            color="secondary"
            variant="description"
            as="p"
            dataTestId={{ root: 'changeRoleModalText' }}
          >
            {copy.hint}
          </Typography>
        )}
      </Stack>
    </FormModalShell>
  );
};
