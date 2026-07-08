import { FC } from 'react';
import { useDisplayOperatorType } from 'shared/hooks';
import { DescriptorCurveStyle } from './styles';
import { DisplayOperatorType, OPERATOR_TYPE_METADATA } from 'consts';

type Props = {
  type?: DisplayOperatorType;
  curveId?: bigint;
  noStyle?: boolean;
  inline?: boolean;
};

export const CurveBadge: FC<Props> = ({ type, curveId, noStyle, inline }) => {
  const typeFromCurveId = useDisplayOperatorType(curveId);
  const resolved = type ?? typeFromCurveId;

  if (!resolved) return null;

  return (
    <DescriptorCurveStyle
      $variant={noStyle ? undefined : resolved}
      $inline={inline}
    >
      {OPERATOR_TYPE_METADATA[resolved].short}
    </DescriptorCurveStyle>
  );
};
