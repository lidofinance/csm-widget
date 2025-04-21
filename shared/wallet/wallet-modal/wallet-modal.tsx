import {
  Address,
  ButtonIcon,
  Copy,
  External,
  Identicon,
  Modal,
} from '@lidofinance/lido-ui';
import { useCallback } from 'react';
import { useConnectorInfo, useDisconnect } from 'reef-knot/core-react';

import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import Link from 'next/link';
import type { ModalComponentType } from 'providers/modal-provider';
import { useAccount, useCopyToClipboard } from 'shared/hooks';
import {
  WalletModalAccountStyle,
  WalletModalActionsStyle,
  WalletModalAddressStyle,
  WalletModalConnectedStyle,
  WalletModalConnectorStyle,
  WalletModalContentStyle,
  WalletModalDisconnectStyle,
} from './styles';

export const WalletModal: ModalComponentType = ({ onClose, ...props }) => {
  const { address, chainId } = useAccount();
  const { connectorName } = useConnectorInfo();
  const { disconnect } = useDisconnect();

  const handleDisconnect = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleCopy = useCopyToClipboard(address ?? '');

  if (!address) return null;

  return (
    <Modal title="Account" onClose={onClose} {...props}>
      <WalletModalContentStyle>
        <WalletModalConnectedStyle>
          {connectorName && (
            <WalletModalConnectorStyle data-testid="providerName">
              Connected with {connectorName}
            </WalletModalConnectorStyle>
          )}

          {disconnect && (
            <WalletModalDisconnectStyle
              size="xs"
              variant="outlined"
              onClick={handleDisconnect}
            >
              Disconnect
            </WalletModalDisconnectStyle>
          )}
        </WalletModalConnectedStyle>

        <WalletModalAccountStyle>
          <Identicon address={address} />
          <WalletModalAddressStyle>
            <Address
              data-testid="connectedAddress"
              address={address}
              symbols={6}
            />
          </WalletModalAddressStyle>
        </WalletModalAccountStyle>

        <WalletModalActionsStyle>
          <ButtonIcon
            data-testid="copyAddressBtn"
            onClick={handleCopy}
            icon={<Copy />}
            size="xs"
            variant="ghost"
          >
            Copy address
          </ButtonIcon>
          <Link href={getEtherscanAddressLink(chainId ?? 1, address)}>
            <ButtonIcon
              data-testid="etherscanBtn"
              icon={<External />}
              size="xs"
              variant="ghost"
            >
              View on Etherscan
            </ButtonIcon>
          </Link>
        </WalletModalActionsStyle>
      </WalletModalContentStyle>
    </Modal>
  );
};
