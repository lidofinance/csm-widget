import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { OperatorRef } from 'modules/web3';
import { useModalActions } from 'providers/modal-provider';
import { FC, ReactNode, useCallback } from 'react';
import { useSwitchOperator } from '../use-switch-operator';
import { useNeedsOperatorSwitch } from './use-needs-operator-switch';

type Props = {
  operator: OperatorRef;
  path?: PATH;
  children?: ReactNode;
};

export const SwitchToOperatorButton: FC<Props> = ({
  operator,
  path,
  children,
}) => {
  const { closeModal } = useModalActions();
  const switchOperator = useSwitchOperator(path ?? PATH.HOME);
  const needsSwitch = useNeedsOperatorSwitch(operator);

  const handleClick = useCallback(() => {
    closeModal();
    switchOperator(operator);
  }, [closeModal, operator, switchOperator]);

  if (!needsSwitch) return null;

  return (
    <Button
      fullwidth
      size="sm"
      onClick={handleClick}
      data-testid="switchToOperatorBtn"
    >
      {children ?? `Switch to Node Operator #${operator.nodeOperatorId}`}
    </Button>
  );
};
