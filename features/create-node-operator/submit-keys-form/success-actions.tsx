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

type Props = {
  operator: OperatorRef;
};

export const SubmitKeysSuccessActions: FC<Props> = ({ operator }) => {
  const { closeModal } = useModalActions();
  const switchToKeysView = useSwitchOperator(PATH.KEYS_VIEW);
  const needsSwitch = useNeedsOperatorSwitch(operator);

  // no auto-switch on create, so View keys must switch to the new operator first
  const handleViewKeys = () => {
    closeModal();
    switchToKeysView(operator);
  };

  return (
    <Stack direction="column" gap="sm">
      <SwitchToOperatorButton operator={operator} />
      <Button fullwidth size="sm" onClick={handleViewKeys}>
        {needsSwitch ? 'Switch and View keys' : 'View keys'}
      </Button>
    </Stack>
  );
};
