import { ButtonProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { Descriptor } from '../descriptor/descriptor';
import { useSwitchModal } from '../switch-modal';
import { ButtonStyle, ButtonWrapperStyle } from './styles';
import { NodeOperatorId } from 'types';
import { trackMatomoEvent } from 'utils';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useSwitchModal();
  const { active, list, switchActive } = useNodeOperatorContext();

  const handleClick = useCallback(
    (id: NodeOperatorId) => {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator);
      switchActive(id);
    },
    [switchActive],
  );

  if (!active) return null;

  return (
    <ButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={() => openModal({ active, list, onChange: handleClick })}
      {...rest}
    >
      <ButtonWrapperStyle>
        <Descriptor nodeOperator={active} />
      </ButtonWrapperStyle>
    </ButtonStyle>
  );
};
