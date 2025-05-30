import { ButtonProps, useBreakpoint } from '@lidofinance/lido-ui';
import { useEthereumBalance } from 'modules/web3';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { useAccount } from 'shared/hooks';
import { useWalletModal } from '../wallet-modal/use-wallet-modal';
import {
  AddressBadgeStyle,
  AddressStyle,
  WalledButtonBalanceStyle,
  WalledButtonLoaderStyle,
  WalledButtonStyle,
  WalledButtonWrapperStyle,
} from './styles';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useWalletModal();
  const { address } = useAccount();
  const { data: balance, isPending } = useEthereumBalance();
  const isMobile = useBreakpoint('md');

  return (
    <WalledButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={() => openModal({})}
      {...rest}
    >
      <WalledButtonWrapperStyle>
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
      </WalledButtonWrapperStyle>
    </WalledButtonStyle>
  );
};
