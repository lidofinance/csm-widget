import { ButtonProps, useBreakpoint } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus, useEthereumBalance } from 'modules/web3';
import { FC, useCallback } from 'react';
import { FormatToken } from 'shared/formatters';
import { trackMatomoEvent } from 'utils';
import { useWalletModal } from '../wallet-modal/use-wallet-modal';
import {
  AddressBadgeStyle,
  AddressStyle,
  WalledButtonBalanceStyle,
  WalledButtonLoaderStyle,
  WalledButtonStyle,
} from './styles';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useWalletModal();
  const { address } = useDappStatus();
  const { data: balance, isPending } = useEthereumBalance();
  const isMobile = useBreakpoint('md');

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickWalletButton);
    openModal({});
  }, [openModal]);

  return (
    <WalledButtonStyle onClick={handleClick} {...rest}>
      <WalledButtonBalanceStyle>
        {isPending ? (
          <WalledButtonLoaderStyle />
        ) : (
          <FormatToken amount={balance} symbol="ETH" />
        )}
      </WalledButtonBalanceStyle>
      <AddressBadgeStyle>
        <AddressStyle address={address} symbols={isMobile ? 3 : 6} />
      </AddressBadgeStyle>
    </WalledButtonStyle>
  );
};
