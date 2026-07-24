import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle, IconTooltip, InputAddress, Stack } from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import { useApplyFormData } from '../context';
import { MainAddressTooltipContent } from './main-address-tooltip-content';

export const MainAddress: FC = () => {
  const { mainAddress } = useApplyFormData(true);

  return (
    <Stack direction="column" gap="md" data-testid="mainAddressSection">
      <Stack direction="column" gap="xxs">
        <FormTitle>Main address</FormTitle>
        <Text size="xs" color="secondary">
          You are requesting IDVTC operator type for the following address:
          <IconTooltip inline tooltip={<MainAddressTooltipContent />} />
        </Text>
      </Stack>
      <InputAddress
        fullwidth
        disabled
        name="mainAddress"
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
