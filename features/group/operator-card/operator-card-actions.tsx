import {
  MODULE_NAME,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { PATH } from 'consts/urls';
import { useNodeOperator } from 'modules/web3';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { FC, useCallback, useMemo } from 'react';
import { LocalLink } from 'shared/navigate';
import { isSameOperator, useSwitchOperator } from 'shared/node-operator';
import { trackMatomoEvent } from 'utils';
import { isAddressEqual } from 'viem';

type Props = {
  nodeOperatorId: NodeOperatorId;
  info: NodeOperatorInfo | undefined;
  moreKeys: boolean;
};

export const OperatorCardActions: FC<Props> = ({
  nodeOperatorId,
  info,
  moreKeys,
}) => {
  const { nodeOperator } = useNodeOperator();
  const { address } = useDappStatus();
  const switchOperator = useSwitchOperator(PATH.HOME);

  const operatorRef = useMemo(
    () => ({ nodeOperatorId, module: MODULE_NAME.CM }),
    [nodeOperatorId],
  );

  const handleSwitch = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.groupSwitchOperator);
    switchOperator(operatorRef);
  }, [operatorRef, switchOperator]);

  const isCurrentOperator = isSameOperator(operatorRef, nodeOperator);

  const isManagerByCurrentWallet =
    !!address && !!info && isAddressEqual(info.managerAddress, address);

  const isRewardsByCurrentWallet =
    !!address && !!info && isAddressEqual(info.rewardsAddress, address);

  if (isCurrentOperator) {
    if (isManagerByCurrentWallet) {
      return (
        <LocalLink href={PATH.KEYS_SUBMIT} data-testid="uploadKeysLink">
          <Button fullwidth variant="outlined" color="primary">
            Upload keys
          </Button>
        </LocalLink>
      );
    }
    return null;
  }

  if (isManagerByCurrentWallet && moreKeys) {
    return (
      <Button
        fullwidth
        variant="outlined"
        color="warning"
        onClick={handleSwitch}
        data-testid="switchAndUploadButton"
      >
        Switch to this operator and upload keys
      </Button>
    );
  }

  if (isManagerByCurrentWallet || isRewardsByCurrentWallet) {
    return (
      <Button
        fullwidth
        variant="outlined"
        color="primary"
        onClick={handleSwitch}
        data-testid="switchOperatorButton"
      >
        Switch to this operator
      </Button>
    );
  }

  return (
    <Button
      fullwidth
      variant="outlined"
      disabled
      data-testid="differentWalletMessage"
    >
      <Text size="xxs" color="secondary">
        This Node Operator is managed by a different wallet. Switch wallets to
        upload keys.
      </Text>
    </Button>
  );
};
