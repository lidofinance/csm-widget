import { Button, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import { ButtonsStyle } from './styles';

type ConfirmHighCostModalAppProps = ConfirmModalProps & { open?: boolean };

export const ConfirmHighCostModalApp: FC<ConfirmHighCostModalAppProps> = ({
  open,
  onConfirm,
  onReject,
}) => (
  <FormModalShell
    ui="app"
    open={open}
    onClose={onReject}
    title="High ejection cost detected"
    subtitle="The ejection cost per key is unusually high. You may want to wait for ejection fees to decrease."
    data-testid="confirmHighCostModal"
  >
    <Stack direction="column" gap={24}>
      <Typography variant="body" weight="semibold" as="p">
        Are you sure you want to proceed?
      </Typography>
      <ButtonsStyle>
        <Button variant="outline" onClick={onReject}>
          Later
        </Button>
        <Button onClick={onConfirm}>Continue anyway</Button>
      </ButtonsStyle>
    </Stack>
  </FormModalShell>
);
