import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { CSSProperties, FC } from 'react';
import { useDisplayOperatorType } from 'shared/hooks';
import { CURVE_GRADIENTS } from './curve-gradients';
import { DisplayOperatorType, OPERATOR_TYPE_METADATA } from 'consts';
import s from './curve-badge.module.css';

type Props = {
  type?: DisplayOperatorType;
  curve?: CurveRef;
  inline?: boolean;
};

export const CurveBadge: FC<Props> = ({ type, curve, inline }) => {
  const typeFromCurve = useDisplayOperatorType(curve);
  const resolved = type ?? typeFromCurve;

  if (!resolved) return null;

  return (
    <span
      className={s.root}
      data-inline={inline || undefined}
      style={{ '--curve-gradient': CURVE_GRADIENTS[resolved] } as CSSProperties}
    >
      {OPERATOR_TYPE_METADATA[resolved].short}
    </span>
  );
};
