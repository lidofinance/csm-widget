import { EmptyState, Modal } from '@lidofinance/lido-app-ui';

import { useAddressValidation } from 'providers/address-validation-provider';

import { WarningIcon } from './styles';

export const SecurityStatusBanner = () => {
  const { isValidAddress, resetIsValidAddress } = useAddressValidation();

  return (
    <Modal withOverlay open={!isValidAddress} onClose={resetIsValidAddress}>
      <EmptyState
        illustration={<WarningIcon />}
        title="Sorry, access is currently unavailable"
      />
    </Modal>
  );
};
