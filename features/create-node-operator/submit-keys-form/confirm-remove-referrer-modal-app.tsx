import { Button, Grid, IconWarning, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

const WARNING_ICON_STYLE = { color: 'var(--lido-app-ui-color-icons-warning)' };

export const ConfirmRemoveReferrerModalApp: FC<
  ConfirmModalProps & { open?: boolean }
> = ({ open, onConfirm, onReject }) => (
  <FormModalShell
    open={open}
    onClose={onReject}
    title="Are you sure?"
    subtitle="Do you really want to delete referrer address and make your Buddy cry?"
    data-testid="confirmRemoveReferrerModal"
  >
    <Stack direction="column" gap={24} align="stretch">
      <Stack justify="center">
        <IconWarning width={48} height={48} style={WARNING_ICON_STYLE} />
      </Stack>
      <Grid columns={2} gap={12}>
        <Button fullWidth onClick={onReject}>
          Cancel
        </Button>
        <Button fullWidth variant="outline" onClick={onConfirm}>
          Continue
        </Button>
      </Grid>
    </Stack>
  </FormModalShell>
);
