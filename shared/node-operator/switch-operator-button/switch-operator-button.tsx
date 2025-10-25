import { ButtonProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  useAvailableOperators,
  useDappStatus,
  useNodeOperator,
} from 'modules/web3';
import { Counter, Stack } from 'shared/components';
import { trackMatomoEvent } from 'utils';
import { Descriptor } from '../descriptor/descriptor';
import { useSwitchModal } from '../switch-modal';
import { ButtonStyle } from './styles';

export const SwitchOperatorButton: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { isSupportedChain } = useDappStatus();
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

  if (!isSupportedChain || !nodeOperator || !list || list.length === 0)
    return null;

  return (
    <ButtonStyle
      onClick={() =>
        openModal({ active: nodeOperator, list, onChange: handleClick })
      }
      {...rest}
    >
      <Stack gap="sm">
        <Descriptor nodeOperator={nodeOperator} hideType />
        {list.length > 1 && <Counter count={list.length} type="operators" />}
      </Stack>
    </ButtonStyle>
  );
};
