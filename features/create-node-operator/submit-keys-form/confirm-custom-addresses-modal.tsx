import { Address, Block, Box, Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { FC, useCallback, useState } from 'react';
import { Stack, StepIndicator, Ul } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

type Props = {
  rewardsAddress: string;
  managerAddress: string;
  extendedManagerPermissions: boolean;
};

export const ConfirmCustomAddressesModal: ModalComponentType<
  ConfirmModalProps & Props
> = ({
  rewardsAddress,
  managerAddress,
  extendedManagerPermissions,
  onConfirm,
  onReject,
  ...props
}) => {
  const [step, setStep] = useState(0);

  const onContinue = useCallback(() => {
    if (step === 0 && extendedManagerPermissions) {
      setStep(1);
    } else {
      onConfirm();
    }
  }, [extendedManagerPermissions, onConfirm, step]);

  return (
    <Modal
      {...props}
      title={
        <Text as="h4" size="lg" weight={700}>
          Confirm addresses configuration
        </Text>
      }
      onClose={onReject}
    >
      <Stack direction="column" gap="xxl">
        {step === 0 ? (
          <CustomAddresses
            {...{ rewardsAddress, managerAddress, extendedManagerPermissions }}
          />
        ) : (
          <ExtendedManagerPermissions />
        )}

        <Stack>
          <Button variant="translucent" fullwidth onClick={onReject}>
            Cancel
          </Button>
          <Button fullwidth onClick={onContinue}>
            Continue
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

const CustomAddresses: FC<Props> = ({
  rewardsAddress,
  managerAddress,
  extendedManagerPermissions,
}) => (
  <>
    <Stack direction="column" gap="sm">
      <Text as="h5" size="sm" weight={700}>
        Are you sure you want to set the following custom addresses?
      </Text>
      <Text size="xs" color="secondary">
        Please doublecheck the new addresses for the Node Operator. Keep in mind
        that in case of wrong addresses specified, you can lose the access to
        your Node Operator and your bond submitted and rewards acquired.
      </Text>
    </Stack>

    <Stack direction="column">
      <Stack direction="column" gap="xs">
        <Text size="xs">Rewards address</Text>
        <Text size="xs" weight={700}>
          <Address as="span" address={rewardsAddress} symbols={21} />
        </Text>
      </Stack>

      <Stack direction="column" gap="xs">
        <Text size="xs">Manager address</Text>
        <Text size="xs" weight={700}>
          <Address as="span" address={managerAddress} symbols={21} />
        </Text>
      </Stack>
    </Stack>
    {extendedManagerPermissions && <StepIndicator length={2} current={0} />}
  </>
);

const ExtendedManagerPermissions: FC = () => (
  <>
    <Stack direction="column" gap="sm">
      <Text as="h5" size="sm" weight={700}>
        Are you sure you want to set the following permissions for your
        addresses?
      </Text>
      <Text size="xs" color="secondary">
        These permissions can only be selected during Node Operator Creation,
        and cannot be changed in the future.
      </Text>
    </Stack>

    <Block color="background" paddingLess>
      <Box color="text" fontSize={2} lineHeight={1.5} padding={12}>
        <Ul>
          <li>
            Rewards address <b>cannot</b> reset the manager address
          </li>
          <li>
            Manager address <b>can</b> change the rewards address
          </li>
        </Ul>
      </Box>
    </Block>
    <StepIndicator length={2} current={1} />
  </>
);
