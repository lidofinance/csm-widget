import { FC } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack, Ul } from 'shared/components';
import { SubmitKeysFormInputType } from '../context';
import { Text } from '@lidofinance/lido-ui';

export const RewardsAddressTypeSelect: FC = () => {
  const {
    field,
    formState: { defaultValues },
  } = useController<SubmitKeysFormInputType, 'extendedManagerPermissions'>({
    name: 'extendedManagerPermissions',
  });

  return (
    <Stack>
      <RadioButton
        small
        {...field}
        {...{
          value: false,
          children: (
            <Stack direction="column" gap="sm">
              <Text size="xs" weight={700}>
                Wallet
              </Text>
              <Ul>
                <li>Rewards address can reset the manager address</li>
                <li>Manager address cannot change the rewards address</li>
              </Ul>
            </Stack>
          ),
          defaultChecked: !defaultValues?.extendedManagerPermissions,
        }}
      />
      <RadioButton
        small
        {...field}
        {...{
          value: true,
          children: (
            <Stack direction="column" gap="sm">
              <Text size="xs" weight={700}>
                Smart contract
              </Text>
              <Ul>
                <li>Rewards address cannot reset the manager address</li>
                <li>Manager address can change the rewards address</li>
              </Ul>
            </Stack>
          ),
          defaultChecked: defaultValues?.extendedManagerPermissions,
        }}
      />
    </Stack>
  );
};
