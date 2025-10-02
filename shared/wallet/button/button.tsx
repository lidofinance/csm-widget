import { ButtonProps, useBreakpoint } from '@lidofinance/lido-ui';
import { useDappStatus, useEthereumBalance } from 'modules/web3';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
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

  return (
    <WalledButtonStyle onClick={() => openModal({})} {...rest}>
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
