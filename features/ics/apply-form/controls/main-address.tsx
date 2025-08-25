import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle, InputAddress, Stack } from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import { useApplyFormData } from '../context/apply-form-provider';

export const MainAddress: FC = () => {
  const { mainAddress } = useApplyFormData();

  return (
    <Stack direction="column" gap="md">
      <Stack direction="column" gap="xxs">
        <FormTitle>Main address</FormTitle>
        <Text size="xs" color="secondary">
          You are requesting ICS operator type to the following address:
        </Text>
      </Stack>
      <InputAddress
        fullwidth
        disabled
        label={
          <>
            Main address <VerifiedChip color="primary">Verified</VerifiedChip>
          </>
        }
        value={mainAddress}
      />
    </Stack>
  );
};
