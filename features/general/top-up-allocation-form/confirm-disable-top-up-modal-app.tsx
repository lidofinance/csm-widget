import { Button, Grid, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

type ConfirmDisableTopUpModalAppProps = ConfirmModalProps & {
  open?: boolean;
};

export const ConfirmDisableTopUpModalApp: FC<
  ConfirmDisableTopUpModalAppProps
> = ({ open, onConfirm, onReject }) => (
  <FormModalShell
    ui="app"
    open={open}
    onClose={onReject}
    title="Confirm disabling top-ups"
    data-testid="confirmDisableTopUpModal"
  >
    <Stack direction="column" gap={24}>
      <Stack direction="column" gap={8}>
        <Typography variant="bodyLarge" weight="semibold" as="h3">
          Are you sure you want to disable top-up deposits?
        </Typography>
        <Typography color="secondary" variant="body" as="p">
          Your operator will stop receiving top-up deposits. They can be enabled
          back only by the CMC.
        </Typography>
      </Stack>
      <Grid columns={2} gap={12}>
        <Button variant="outline" onClick={onReject}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </Grid>
    </Stack>
  </FormModalShell>
);
