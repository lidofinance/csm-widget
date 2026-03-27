import { NodeOperatorId, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useNodeOperator } from 'modules/web3';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { useNavigate } from 'shared/navigate/use-navigate';

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
  const { nodeOperator, switchNodeOperator } = useNodeOperator();
  const { address } = useDappStatus();
  const navigate = useNavigate();

  const isCurrentOperator = nodeOperator?.nodeOperatorId === nodeOperatorId;

  const isManagedByCurrentWallet =
    !!address &&
    !!info &&
    (info.managerAddress.toLowerCase() === address.toLowerCase() ||
      info.rewardsAddress.toLowerCase() === address.toLowerCase());

  if (isCurrentOperator) {
    return (
      <LocalLink href={PATH.KEYS_SUBMIT}>
        <Button fullwidth variant="outlined" color="primary">
          Upload keys
        </Button>
      </LocalLink>
    );
  }

  if (isManagedByCurrentWallet && moreKeys) {
    return (
      <Button
        fullwidth
        variant="outlined"
        color="warning"
        onClick={() => {
          switchNodeOperator(nodeOperatorId);
          void navigate(PATH.KEYS_SUBMIT);
        }}
      >
        Switch to this operator and upload keys
      </Button>
    );
  }

  if (isManagedByCurrentWallet) {
    return (
      <Button
        fullwidth
        variant="outlined"
        color="primary"
        onClick={() => switchNodeOperator(nodeOperatorId)}
      >
        Switch to this operator
      </Button>
    );
  }

  return (
    <Button fullwidth variant="outlined" disabled>
      <Text size="xxs" color="secondary">
        This Node Operator is managed by a different wallet. Switch wallets to
        upload keys.
      </Text>
    </Button>
  );
};
