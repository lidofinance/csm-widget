import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import {
  useCurveParameters,
  useNodeOperatorId,
  useOperatorCurveId,
  useOperatorType,
} from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { useParametersModal } from '../parameters-modal';
import { ButtonStyle, ButtonWrapperStyle } from './styles';

export const TypeButton: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useParametersModal();
  const nodeOperatorId = useNodeOperatorId();
  const { data: type } = useOperatorType(nodeOperatorId);
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  useCurveParameters(curveId); // pre-fetching

  if (!type || curveId === undefined) return null;

  return (
    <ButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={() => openModal({ type, curveId })}
      $variant={type}
      {...rest}
    >
      <ButtonWrapperStyle>
        <CurveBadge type={type} noStyle />
      </ButtonWrapperStyle>
    </ButtonStyle>
  );
};
