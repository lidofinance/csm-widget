import {
  Address,
  Body,
  Button,
  Caption,
  IconCopy,
  IconEtherscan,
  Identicon,
  Modal,
} from '@lidofinance/lido-app-ui';
import { useCallback, useEffect } from 'react';
import { useConnectorInfo, useDisconnect } from 'reef-knot/core-react';

import { useDappStatus } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { useCopyToClipboard } from 'shared/hooks';
import {
  WalletModalAccountStyle,
  WalletModalActionsStyle,
  WalletModalConnectedStyle,
  WalletModalDisconnectStyle,
} from './styles';
import { getEtherscanAddressLink } from 'utils';

export const WalletModal: ModalComponentType = ({ onClose }) => {
  const { address, chainId } = useDappStatus();
  const { connectorName } = useConnectorInfo();
  const { disconnect } = useDisconnect();

  const handleDisconnect = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleCopy = useCopyToClipboard(address ?? '');

  useEffect(() => {
    // Close the modal if a wallet was somehow disconnected while the modal was open
    if (address == null || address.length === 0) {
      onClose?.();
    }
  }, [address, onClose]);

  if (!address) return null;

  return (
    <Modal
      withOverlay
      title="Account"
      onClose={onClose}
      data-testid="walletModal"
    >
      <WalletModalConnectedStyle>
        {connectorName && (
          <Caption color="secondary" data-testid="providerName">
            Connected with {connectorName}
          </Caption>
        )}

        {disconnect && (
          <WalletModalDisconnectStyle
            size="small"
            variant="outline"
            onClick={handleDisconnect}
          >
            Disconnect
          </WalletModalDisconnectStyle>
        )}
      </WalletModalConnectedStyle>

      <WalletModalAccountStyle>
        <Identicon address={address} size={32} />
        <Body weight="bold">
          <Address
            data-testid="connectedAddress"
            address={address}
            symbols={6}
          />
        </Body>
      </WalletModalAccountStyle>

      <WalletModalActionsStyle>
        <Button
          variant="ghost"
          size="small"
          iconLeft={<IconCopy />}
          onClick={handleCopy}
          data-testid="copyAddressBtn"
        >
          Copy address
        </Button>
        <Button
          variant="ghost"
          size="small"
          iconLeft={<IconEtherscan />}
          href={getEtherscanAddressLink(chainId ?? 1, address)}
          data-testid="etherscanBtn"
        >
          View on Etherscan
        </Button>
      </WalletModalActionsStyle>
    </Modal>
  );
};
