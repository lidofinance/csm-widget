import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useDisplayOperatorType } from 'shared/hooks';
import { DescriptorCurveStyle } from './styles';
import { DisplayOperatorType, OPERATOR_TYPE_METADATA } from 'consts';

type Props = {
  type?: DisplayOperatorType;
  curve?: CurveRef;
  noStyle?: boolean;
  inline?: boolean;
};

export const CurveBadge: FC<Props> = ({ type, curve, noStyle, inline }) => {
  const typeFromCurve = useDisplayOperatorType(curve);
  const resolved = type ?? typeFromCurve;

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
