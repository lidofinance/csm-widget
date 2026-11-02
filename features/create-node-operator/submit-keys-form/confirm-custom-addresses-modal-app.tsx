import {
  Address,
  Button,
  IconLink,
  MessageBox,
  Stack,
  TextLink,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { FC, Fragment, useCallback, useState } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';
import styled from 'styled-components';
import invariant from 'tiny-invariant';
import { getEtherscanAddressLink, trackMatomoEvent } from 'utils';
import { getAddressesConfirmState } from './confirm-custom-addresses-steps';

type ConfirmCustomAddressesModalAppProps = ConfirmModalProps & {
  open?: boolean;
  rewardsAddress?: string;
  managerAddress?: string;
  extendedManagerPermissions: boolean;
};

const SecondaryTextStyle = styled(Typography)`
  && {
    color: var(--lido-app-ui-color-text-secondary);
  }
`;

const PermissionsListStyle = styled.ol`
  margin: 0;
  padding-left: 20px;
`;

const ButtonsStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const DotsStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DotStyle = styled.span<{ $done: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $done }) =>
    $done
      ? 'var(--lido-app-ui-color-text-default)'
      : 'var(--lido-app-ui-color-border-default)'};
`;

const DotLineStyle = styled.span<{ $done: boolean }>`
  width: 24px;
  height: 2px;
  background: ${({ $done }) =>
    $done
      ? 'var(--lido-app-ui-color-text-default)'
      : 'var(--lido-app-ui-color-border-default)'};
`;

const StepDots: FC<{ count: number; current: number }> = ({
  count,
  current,
}) => (
  <DotsStyle role="img" aria-label={`Step ${current + 1} of ${count}`}>
    {Array.from({ length: count }, (_, index) => (
      <Fragment key={index}>
        {index > 0 && <DotLineStyle $done={index <= current} />}
        <DotStyle $done={index <= current} />
      </Fragment>
    ))}
  </DotsStyle>
);

const AddressRow: FC<{ label: string; address: string }> = ({
  label,
  address,
}) => {
  const { chainId } = useDappStatus();

  return (
    <Stack direction="column" gap={4}>
      <SecondaryTextStyle variant="body" forwardedAs="span">
        {label}
      </SecondaryTextStyle>
      <Typography variant="body" as="div">
        <Address address={address} symbols={0}>
          <TextLink
            external
            href={getEtherscanAddressLink(chainId, address)}
            icon={<IconLink />}
            aria-label={`View ${label} on Etherscan`}
            onClick={() =>
              trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink)
            }
          />
        </Address>
      </Typography>
    </Stack>
  );
};

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
      ui="app"
      open={open}
      onClose={onReject}
      title="Confirm addresses configuration"
      data-testid="confirmCustomAddressesModal"
    >
      <Stack direction="column" gap={24}>
        <Stack direction="column" gap={8}>
          <Typography variant="bodyLarge" weight="semibold" as="h3">
            Are you sure you want to set the following custom addresses?
          </Typography>
          <SecondaryTextStyle variant="body" forwardedAs="p">
            {step === 0
              ? 'Please doublecheck the new addresses for the Node Operator. Keep in mind that in case of wrong addresses specified, you can lose the access to your Node Operator and your bond submitted and rewards acquired.'
              : 'These permissions can only be selected during Node Operator Creation, and cannot be changed in the future'}
          </SecondaryTextStyle>
        </Stack>

        {step === 0 ? (
          <Stack direction="column" gap={16}>
            <AddressRow label="Rewards Address" address={rewardsAddress} />
            <AddressRow label="Manager Address" address={managerAddress} />
          </Stack>
        ) : (
          <MessageBox icon={false}>
            <PermissionsListStyle>
              <li>
                Rewards Address <b>cannot</b> reset the Manager Address
              </li>
              <li>
                Manager Address <b>can</b> reset the Rewards Address
              </li>
            </PermissionsListStyle>
          </MessageBox>
        )}

        {stepsCount > 1 && <StepDots count={stepsCount} current={step} />}

        <ButtonsStyle>
          <Button variant="outline" onClick={onReject}>
            Cancel
          </Button>
          <Button onClick={onContinue}>{actionLabel}</Button>
        </ButtonsStyle>
      </Stack>
    </FormModalShell>
  );
};
