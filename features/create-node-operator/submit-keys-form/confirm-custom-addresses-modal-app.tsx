import {
  Address,
  Button,
  Grid,
  MessageBox,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { FC, Fragment, useCallback, useState } from 'react';
import { EtherscanAddressLink } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import invariant from 'tiny-invariant';
import s from './confirm-custom-addresses-modal-app.module.css';
import { getAddressesConfirmState } from './confirm-custom-addresses-steps';

type ConfirmCustomAddressesModalAppProps = ConfirmModalProps & {
  open?: boolean;
  rewardsAddress?: string;
  managerAddress?: string;
  extendedManagerPermissions: boolean;
};

const StepDots: FC<{ count: number; current: number }> = ({
  count,
  current,
}) => (
  <Stack
    direction="row"
    align="center"
    justify="center"
    role="img"
    aria-label={`Step ${current + 1} of ${count}`}
  >
    {Array.from({ length: count }, (_, index) => (
      <Fragment key={index}>
        {index > 0 && (
          <span
            className={s.dotLine}
            data-done={index <= current || undefined}
          />
        )}
        <span className={s.dot} data-done={index <= current || undefined} />
      </Fragment>
    ))}
  </Stack>
);

const AddressRow: FC<{ label: string; address: string }> = ({
  label,
  address,
}) => (
  <Stack direction="column" gap={4}>
    <Typography variant="body" color="secondary" as="span">
      {label}
    </Typography>
    <Typography variant="body" as="div">
      <Address address={address} symbols={0}>
        <EtherscanAddressLink
          address={address}
          aria-label={`View ${label} on Etherscan`}
        />
      </Address>
    </Typography>
  </Stack>
);

export const ConfirmCustomAddressesModalApp: FC<
  ConfirmCustomAddressesModalAppProps
> = ({
  open,
  rewardsAddress,
  managerAddress,
  extendedManagerPermissions,
  onConfirm,
  onReject,
}) => {
  const [step, setStep] = useState(0);
  const { stepsCount, isLast, actionLabel } = getAddressesConfirmState(
    step,
    extendedManagerPermissions,
  );

  const onContinue = useCallback(() => {
    if (isLast) {
      onConfirm();
    } else {
      setStep((current) => current + 1);
    }
  }, [isLast, onConfirm]);

  invariant(rewardsAddress);
  invariant(managerAddress);

  return (
    <FormModalShell
      open={open}
      onClose={onReject}
      title="Confirm addresses configuration"
      dataTestId={{ root: 'confirmCustomAddressesModal' }}
    >
      <Stack direction="column" gap={24}>
        <Stack direction="column" gap={8}>
          <Typography variant="bodyLarge" weight="semibold" as="h3">
            Are you sure you want to set the following custom addresses?
          </Typography>
          <Typography variant="body" color="secondary" as="p">
            {step === 0
              ? 'Please doublecheck the new addresses for the Node Operator. Keep in mind that in case of wrong addresses specified, you can lose the access to your Node Operator and your bond submitted and rewards acquired.'
              : 'These permissions can only be selected during Node Operator Creation, and cannot be changed in the future'}
          </Typography>
        </Stack>

        {step === 0 ? (
          <Stack direction="column" gap={16}>
            <AddressRow label="Rewards Address" address={rewardsAddress} />
            <AddressRow label="Manager Address" address={managerAddress} />
          </Stack>
        ) : (
          <MessageBox icon={false}>
            <ol className={s.permissionsList}>
              <li>
                Rewards Address <b>cannot</b> reset the Manager Address
              </li>
              <li>
                Manager Address <b>can</b> reset the Rewards Address
              </li>
            </ol>
          </MessageBox>
        )}

        {stepsCount > 1 && <StepDots count={stepsCount} current={step} />}

        <Grid columns={2} gap={12}>
          <Button variant="outline" onClick={onReject}>
            Cancel
          </Button>
          <Button onClick={onContinue}>{actionLabel}</Button>
        </Grid>
      </Stack>
    </FormModalShell>
  );
};
