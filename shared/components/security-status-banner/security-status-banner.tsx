import { EmptyState, Modal } from '@lidofinance/lido-app-ui';

import { useAddressValidation } from 'providers/address-validation-provider';

import WarningIconSrc from 'assets/icons/attention-triangle.svg';

import s from './styles.module.css';

export const SecurityStatusBanner = () => {
  const { isValidAddress, resetIsValidAddress } = useAddressValidation();

  return (
    <Modal withOverlay open={!isValidAddress} onClose={resetIsValidAddress}>
      <EmptyState
        illustration={
          <img className={s.warningIcon} src={WarningIconSrc} alt="warning" />
        }
        title="Sorry, access is currently unavailable"
      />
    </Modal>
  );
};
