import { ButtonProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { trackMatomoEvent } from 'utils';
import { Descriptor } from '../descriptor/descriptor';
import { useSwitchModal } from '../switch-modal';
import { ButtonStyle } from './styles';

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
      onClick={() =>
        openModal({ active: nodeOperator, list, onChange: handleClick })
      }
      {...rest}
    >
      <Descriptor nodeOperator={nodeOperator} hideType />
    </ButtonStyle>
  );
};
