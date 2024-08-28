import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { Descriptor } from '../descriptor/descriptor';
import { useSwitchModal } from '../switch-modal';
import { ButtonStyle, ButtonWrapperStyle } from './styles';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useSwitchModal();
  const nodeOperator = useActiveNodeOperator();

  if (!nodeOperator) return null;

  return (
    <ButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={() => openModal({})}
      {...rest}
    >
      <ButtonWrapperStyle>
        <Descriptor nodeOperator={nodeOperator} />
      </ButtonWrapperStyle>
    </ButtonStyle>
  );
};
