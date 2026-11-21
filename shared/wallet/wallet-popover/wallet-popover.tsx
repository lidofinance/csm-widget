import {
  Address,
  Copy,
  IconEtherscan,
  Identicon,
  Popover,
  Stack,
  ThemeName,
  Typography,
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

import { EtherscanAddressLink } from 'shared/components/external-icon-link/etherscan-address-link';
import { notifyCopied } from 'shared/hooks';
import { Disconnect } from '../disconnect/disconnect';
import s from './wallet-popover.module.css';

type WalletPopoverProps = {
  address: string;
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
};

const POPUP_OFFSET = 4;

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
    <span
      className={s.badge}
      data-testid="providerName"
      title={label}
      aria-label={label}
    >
      {Icon ? (
        <Icon />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={validateIcon(connector?.icon ?? '') ?? FALLBACK_WALLET_ICON}
          alt=""
        />
      )}
    </span>
  );
};

export const WalletPopover: FC<WalletPopoverProps> = ({
  address,
  open,
  onClose,
  anchorRef,
}) => {
  return (
    <Popover
      className={s.popup}
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="bottom"
      align="end"
      arrow
      offset={POPUP_OFFSET}
      width={400}
      aria-label="Account"
      data-testid="walletModal"
    >
      <Stack align="center" gap={24} className={s.account}>
        <div className={s.avatar}>
          <Identicon address={address} size={64} />
          <WalletBadge />
        </div>
        <Stack
          direction="row"
          align="center"
          justify="center"
          gap={8}
          className={s.addressRow}
        >
          <Typography
            variant="h3"
            weight="medium"
            color="default"
            as="span"
            className={s.address}
            data-testid="connectedAddress"
          >
            <Address address={address} symbols={4} />
          </Typography>
          <Copy
            className={s.copy}
            text={address}
            onCopy={notifyCopied}
            labels={{ copy: 'Copy address', copied: 'Address copied' }}
            data-testid="copyAddressBtn"
          />
          <EtherscanAddressLink
            className={s.etherscan}
            address={address}
            icon={<IconEtherscan />}
            aria-label="View on Etherscan"
            data-testid="etherscanBtn"
          />
        </Stack>
      </Stack>
      <Disconnect fullWidth variant="outline" onClick={onClose}>
        Disconnect wallet
      </Disconnect>
    </Popover>
  );
};
