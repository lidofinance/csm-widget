import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { FC } from 'react';
import { Stack } from 'shared/components';
import {
  SwitchToOperatorButton,
  useNeedsOperatorSwitch,
  useSwitchOperator,
} from 'shared/node-operator';

type Props = {
  nodeOperatorId: NodeOperatorId;
  module: MODULE_NAME;
};

export const SubmitKeysSuccessActions: FC<Props> = ({
  nodeOperatorId,
  module,
}) => {
  const { closeModal } = useModalActions();
  const switchToKeysView = useSwitchOperator(PATH.KEYS_VIEW);
  const needsSwitch = useNeedsOperatorSwitch(nodeOperatorId, module);

  // no auto-switch on create, so View keys must switch to the new operator first
  const handleViewKeys = () => {
    closeModal();
    switchToKeysView(nodeOperatorId, module);
  };

  return (
    <Stack direction="column" gap="sm">
      <SwitchToOperatorButton nodeOperatorId={nodeOperatorId} module={module} />
      <Button fullwidth size="sm" onClick={handleViewKeys}>
        {needsSwitch ? 'Switch and View keys' : 'View keys'}
      </Button>
    </Stack>
  );
};
