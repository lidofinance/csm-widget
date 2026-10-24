import { AddressButton } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { ConnectAppButton, useWalletModal } from 'shared/wallet';
import { trackMatomoEvent } from 'utils';

const HeaderWallet: FC = () => {
  const { isAccountActive, address } = useDappStatus();
  const { openModal } = useWalletModal();

  return isAccountActive ? (
    <AddressButton
      address={address ?? ''}
      data-testid="accountSectionHeader"
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickWalletButton);
        openModal({});
      }}
    />
  ) : (
    <ConnectAppButton />
  );
};

export default HeaderWallet;
