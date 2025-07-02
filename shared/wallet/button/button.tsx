import { useEthereumBalance } from '@lido-sdk/react';
import { ButtonProps, useBreakpoint } from '@lidofinance/lido-ui';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
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
  const { data: balance, initialLoading } = useEthereumBalance(
    undefined,
    STRATEGY_LAZY,
  );
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
          {initialLoading ? (
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
