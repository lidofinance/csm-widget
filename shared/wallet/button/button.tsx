import { Identicon } from '@lidofinance/lido-ui';
import { ButtonHTMLAttributes, FC, useCallback } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { trackMatomoEvent } from 'utils';
import { useWalletModal } from '../wallet-modal/use-wallet-modal';
import { WalletButtonStyle } from './styles';

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { onClick: _onClick, ...rest } = props;
  const { openModal } = useWalletModal();
  const { address } = useDappStatus();

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickWalletButton);
    openModal({});
  }, [openModal]);

  return (
    <WalletButtonStyle type="button" onClick={handleClick} {...rest}>
      <Identicon address={address ?? ''} diameter={28} />
      <span title={address}>
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
      </span>
    </WalletButtonStyle>
  );
};
