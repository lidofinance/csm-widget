import { AddressButton } from '@lidofinance/lido-app-ui';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { ConnectAppButton, WalletPopover } from 'shared/wallet';
import { trackMatomoEvent } from 'utils';

const HeaderWallet: FC = () => {
  const { isAccountActive, address } = useDappStatus();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isAccountActive) setOpen(false);
  }, [isAccountActive]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleClick = () => {
    if (!open) trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickWalletButton);
    setOpen((prev) => !prev);
  };

  return isAccountActive && address ? (
    <>
      <AddressButton
        ref={anchorRef}
        address={address}
        data-testid="accountSectionHeader"
        onClick={handleClick}
      />
      <WalletPopover
        address={address}
        open={open}
        onClose={handleClose}
        anchorRef={anchorRef}
      />
    </>
  ) : (
    <ConnectAppButton />
  );
};

export default HeaderWallet;
