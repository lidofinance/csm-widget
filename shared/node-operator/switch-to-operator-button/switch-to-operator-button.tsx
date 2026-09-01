import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { useModalActions } from 'providers/modal-provider';
import { FC, ReactNode, useCallback } from 'react';
import { useSwitchOperator } from '../use-switch-operator';
import { useNeedsOperatorSwitch } from './use-needs-operator-switch';

type Props = {
  nodeOperatorId: NodeOperatorId;
  module: MODULE_NAME;
  path?: PATH;
  children?: ReactNode;
};

export const SwitchToOperatorButton: FC<Props> = ({
  nodeOperatorId,
  module,
  path,
  children,
}) => {
  const { closeModal } = useModalActions();
  const switchOperator = useSwitchOperator(path ?? PATH.HOME);
  const needsSwitch = useNeedsOperatorSwitch(nodeOperatorId, module);

  const handleClick = useCallback(() => {
    closeModal();
    switchOperator(nodeOperatorId, module);
  }, [closeModal, module, nodeOperatorId, switchOperator]);

  if (!needsSwitch) return null;

  return (
    <Button
      fullwidth
      size="sm"
      onClick={handleClick}
      data-testid="switchToOperatorBtn"
    >
      {children ?? `Switch to Node Operator #${nodeOperatorId}`}
    </Button>
  );
};
