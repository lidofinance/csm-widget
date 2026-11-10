import { Modal, Text } from '@lidofinance/lido-ui';

import { useAddressValidation } from 'providers/address-validation-provider';
import { Stack } from 'shared/components/stack';

import { BannerWrapper, WarningIcon } from './styles';

export const SecurityStatusBanner = () => {
  const { isValidAddress, resetIsValidAddress } = useAddressValidation();

  return (
    <Modal open={!isValidAddress} onClose={resetIsValidAddress}>
      <BannerWrapper>
        <Stack direction="column" center>
          <WarningIcon />
          <Text size="sm">Sorry, access is currently unavailable</Text>
        </Stack>
      </BannerWrapper>
    </Modal>
  );
};
