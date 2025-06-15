import { ButtonProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { Descriptor } from '../descriptor/descriptor';
import { useSwitchModal } from '../switch-modal';
import { ButtonStyle, ButtonWrapperStyle } from './styles';
import { trackMatomoEvent } from 'utils';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useSwitchModal();
  const { data: list } = useAvailableOperators();
  const { nodeOperator, switchNodeOperator } = useNodeOperator();

  const handleClick = useCallback(
    (id: NodeOperatorId) => {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator);
      switchNodeOperator(id);
    },
    [switchNodeOperator],
  );

  if (!nodeOperator || !list || list.length === 0) return null;

  return (
    <ButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={() =>
        openModal({ active: nodeOperator, list, onChange: handleClick })
      }
      {...rest}
    >
      <ButtonWrapperStyle>
        <Descriptor nodeOperator={nodeOperator} hideType />
      </ButtonWrapperStyle>
    </ButtonStyle>
  );
};
