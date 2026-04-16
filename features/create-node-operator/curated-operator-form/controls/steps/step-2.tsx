import { ROLES } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  IconTooltip,
  RoleActionsList,
  Stack,
  WarningBlock,
} from 'shared/components';
import type { CuratedOperatorFormInputType } from '../../context/types';
import { useStepValidation } from '../../hooks/use-step-validation';
import { ManagerAddressInput } from '../manager-address-input';
import { RewardAddressInput } from '../reward-address-input';

// TODO: gaps
export const Step2: FC = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });
  const { setValue } = useFormContext<CuratedOperatorFormInputType>();
  const canContinue = useStepValidation(2);

  if (currentStep !== 2) return null;

  return (
    <Stack direction="column" gap="xxl">
      <Stack direction="column" gap="md">
        <Text as="h3" size="lg" weight={700} data-testid="stepTitle">
          Specify addresses
        </Text>
        <Text size="xs" color="secondary" data-testid="stepDescription">
          <b>Manager Address</b> will have the ultimate control over the Node
          Operator, while <b>Rewards Address</b> is only used to receive
          rewards.
        </Text>
        <ul>
          <li>
            <Text size="xs" color="secondary">
              Rewards Address cannot reset the Manager Address
            </Text>
          </li>
          <li>
            <Text size="xs" color="secondary">
              Manager Address can change the Rewards Address
            </Text>
          </li>
        </ul>
      </Stack>

      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="md">
          <ManagerAddressInput />
          <Text size="xs" color="secondary">
            Has the ultimate control over the Node Operator. Must be a multisig{' '}
            <IconTooltip
              inline
              tooltip={
                <RoleActionsList
                  role={ROLES.MANAGER}
                  extendedManagerPermissions
                />
              }
            />
          </Text>
        </Stack>

        <Stack direction="column" gap="md">
          <RewardAddressInput />
          <Text size="xs" color="secondary">
            Used for receiving rewards. Must be a multisig or smart contract
            address{' '}
            <IconTooltip
              inline
              tooltip={
                <RoleActionsList
                  role={ROLES.REWARDS}
                  extendedManagerPermissions
                />
              }
            />
          </Text>
        </Stack>
      </Stack>

      <WarningBlock type="warning">
        Setting addresses for the Node Operator is <b>at your own risk</b>. If
        you specify an incorrect or incompatible address, you may{' '}
        <b>permanently lose access</b> to your Node Operator, bond, and
        potential rewards.
      </WarningBlock>

      <Stack>
        <Button
          variant="outlined"
          fullwidth
          onClick={() => setValue('step', 1)}
        >
          Back
        </Button>
        <Button
          fullwidth
          disabled={!canContinue}
          onClick={() => setValue('step', 3)}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};
