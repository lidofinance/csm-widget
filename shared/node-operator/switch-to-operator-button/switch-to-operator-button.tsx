import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { OperatorRef } from 'modules/web3';
import { useModalActions } from 'providers/modal-provider';
import { FC, ReactNode, useCallback } from 'react';
import { trackMatomoEvent } from 'utils';
import { useSwitchOperator } from '../use-switch-operator';
import { useNeedsOperatorSwitch } from './use-needs-operator-switch';

type Props = {
  operator: OperatorRef;
  path?: PATH;
  children?: ReactNode;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES;
};

export const SwitchToOperatorButton: FC<Props> = ({
  operator,
  path,
  children,
  variant,
  color,
  matomoEvent,
}) => {
  const { closeModal } = useModalActions();
  const switchOperator = useSwitchOperator(path ?? PATH.HOME);
  const needsSwitch = useNeedsOperatorSwitch(operator);

  const handleClick = useCallback(() => {
    if (matomoEvent) trackMatomoEvent(matomoEvent);
    closeModal();
    switchOperator(operator);
  }, [closeModal, matomoEvent, operator, switchOperator]);

  if (!needsSwitch) return null;

  return (
    <Button
      fullwidth
      size="sm"
      variant={variant}
      color={color}
      onClick={handleClick}
      data-testid="switchToOperatorBtn"
    >
      {children ?? `Switch to Node Operator #${operator.nodeOperatorId}`}
    </Button>
  );
};
