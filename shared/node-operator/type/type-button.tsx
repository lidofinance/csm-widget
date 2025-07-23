import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import {
  getOperatorType,
  useCurveParameters,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { useParametersModal } from '../parameters-modal';
import { ButtonStyle } from './styles';

export const TypeButton: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;
  const { openModal } = useParametersModal();
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  useCurveParameters(curveId); // pre-fetching
  const type = getOperatorType(curveId);

  if (!type || curveId === undefined) return null;

  return (
    <ButtonStyle
      onClick={() => openModal({ curveId })}
      $variant={type}
      {...rest}
    >
      <CurveBadge type={type} noStyle />
    </ButtonStyle>
  );
};
