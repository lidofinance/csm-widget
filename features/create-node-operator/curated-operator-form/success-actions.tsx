import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { OperatorRef } from 'modules/web3';
import { useModalActions } from 'providers/modal-provider';
import { FC } from 'react';
import { Stack } from 'shared/components';
import {
  SwitchToOperatorButton,
  useNeedsOperatorSwitch,
  useSwitchOperator,
} from 'shared/node-operator';
import { useNavigate } from 'shared/navigate';

type Props = {
  nodeOperatorId: NodeOperatorId;
  availableGatesCount: number;
  hasManagerRole: boolean;
};

export const CuratedOperatorSuccessActions: FC<Props> = ({
  nodeOperatorId,
  availableGatesCount,
  hasManagerRole,
}) => {
  const n = useNavigate();
  const { closeModal } = useModalActions();
  const operator: OperatorRef = { nodeOperatorId, module: MODULE_NAME.CM };
  const switchToKeysSubmit = useSwitchOperator(PATH.KEYS_SUBMIT);
  const needsSwitch = useNeedsOperatorSwitch(operator);

  const handleCreateAnother = async () => {
    closeModal();
    void n(PATH.CREATE);
  };

  // no auto-switch on create, so Add keys must switch to the new operator before opening the keys-submit form
  const handleAddKeys = () => {
    closeModal();
    switchToKeysSubmit(operator);
  };

  const showCreateAnother = availableGatesCount > 1;

  return (
    <Stack direction="column" gap="sm">
      <SwitchToOperatorButton operator={operator} />
      {hasManagerRole && (
        <Button fullwidth size="sm" onClick={handleAddKeys}>
          {needsSwitch ? 'Switch and Add keys' : 'Add keys'}
        </Button>
      )}
      {showCreateAnother && (
        <Button
          fullwidth
          size="sm"
          variant="outlined"
          onClick={handleCreateAnother}
        >
          Create another Node Operator
        </Button>
      )}
    </Stack>
  );
};
