import {
  Address,
  IconEtherscan,
  Identicon,
  ThemeName,
  useThemeToggle,
} from '@lidofinance/lido-app-ui';
import { FC, RefObject } from 'react';
import {
  FALLBACK_WALLET_ICON,
  useConnectorInfo,
  useReefKnotContext,
  validateIcon,
} from 'reef-knot';
import { useConnection } from 'wagmi';

import { usePopoverBeak } from 'shared/components/popover-beak';
import { notifyCopied } from 'shared/hooks';
import { Disconnect } from '../disconnect/disconnect';
import {
  AccountStyle,
  AddressRowStyle,
  AddressStyle,
  AvatarStyle,
  BadgeStyle,
  CopyStyle,
  EtherscanLinkStyle,
  PopupStyle,
} from './styles';

type WalletPopoverProps = {
  address: string;
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
};

const POPUP_OFFSET = 12;

const WalletBadge: FC = () => {
  const { connector } = useConnection();
  const { connectorName } = useConnectorInfo();
  const { walletDataList } = useReefKnotContext();
  const { themeName } = useThemeToggle();

  const adapterIcon = walletDataList.find(
    ({ walletId }) => walletId === connector?.id,
  )?.icon;
  const Icon =
    adapterIcon && typeof adapterIcon === 'object' && 'light' in adapterIcon
      ? adapterIcon[themeName === ThemeName.dark ? 'dark' : 'light']
      : adapterIcon;
  // reef-knot leaves connectorName undefined in dapp browsers
  const label = connectorName ?? connector?.name;

  return (
    <BadgeStyle data-testid="providerName" title={label} aria-label={label}>
      {Icon ? (
        <Icon />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={validateIcon(connector?.icon ?? '') ?? FALLBACK_WALLET_ICON}
          alt=""
        />
      )}
    </BadgeStyle>
  );
};

export const WalletPopover: FC<WalletPopoverProps> = ({
  address,
  open,
  onClose,
  anchorRef,
}) => {
  const beakRef = usePopoverBeak(anchorRef);

  return (
    <PopupStyle
      ref={beakRef}
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="bottom"
      align="end"
      offset={POPUP_OFFSET}
      width={400}
      aria-label="Account"
      data-testid="walletModal"
    >
      <AccountStyle>
        <AvatarStyle>
          <Identicon address={address} size={64} />
          <WalletBadge />
        </AvatarStyle>
        <AddressRowStyle>
          <AddressStyle data-testid="connectedAddress">
            <Address address={address} symbols={4} />
          </AddressStyle>
          <CopyStyle
            text={address}
            onCopy={notifyCopied}
            aria-label="Copy address"
            data-testid="copyAddressBtn"
          />
          <EtherscanLinkStyle
            address={address}
            icon={<IconEtherscan />}
            aria-label="View on Etherscan"
            data-testid="etherscanBtn"
          />
        </AddressRowStyle>
      </AccountStyle>
      <Disconnect fullWidth variant="outline" onClick={onClose}>
        Disconnect wallet
      </Disconnect>
    </PopupStyle>
  );
};
