import { Button, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

export type SurveyConfirmModalProps = ConfirmModalProps & { open?: boolean };

type Props = SurveyConfirmModalProps & {
  title: string;
  confirmLabel: string;
  children: ReactNode;
};

export const SurveyConfirmModal: FC<Props> = ({
  open,
  onConfirm,
  onReject,
  title,
  confirmLabel,
  children,
}) => (
  <FormModalShell ui="app" open={open} onClose={onReject} title={title}>
    <Stack direction="column" gap={24}>
      <Typography color="secondary" variant="body" as="p">
        {children}
      </Typography>
      <Button variant="error" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </Stack>
  </FormModalShell>
);
