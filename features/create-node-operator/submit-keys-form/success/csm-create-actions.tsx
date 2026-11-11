import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import type { CreateSuccess } from 'features/create-node-operator/create-success/create-success';
import { FC } from 'react';
import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import {
  useNeedsOperatorSwitch,
  useSwitchOperator,
} from 'shared/node-operator';
import { useDisconnectWallet } from 'shared/wallet';
import { trackMatomoEvent } from 'utils';

export const CsmCreateActions: FC<{ created: CreateSuccess }> = ({
  created,
}) => {
  const needsSwitch = useNeedsOperatorSwitch(created.operator);
  const switchToKeysView = useSwitchOperator(PATH.KEYS);
  const disconnect = useDisconnectWallet();

  const handleDisconnect = () => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.disconnectWallet);
    disconnect();
  };

  return (
    <>
      {created.hasRole ? (
        <Button
          onClick={() => switchToKeysView(created.operator)}
          data-testid={needsSwitch ? 'switchToOperatorBtn' : 'viewKeysBtn'}
        >
          {needsSwitch ? 'Switch to this NO' : 'View keys'}
        </Button>
      ) : (
        <Button onClick={handleDisconnect} data-testid="disconnectBtn">
          Disconnect wallet
        </Button>
      )}
      <TxLinkEtherscan txHash={created.txHash} />
    </>
  );
};
