import { FC } from 'react';
import { CURVE_TYPE } from 'shared/hooks';
import { DescriptorCurveStyle } from './styles';

export const CurveBadge: FC<{ type?: CURVE_TYPE | null }> = ({ type }) => {
  const title = type === CURVE_TYPE.CUSTOM ? 'CC' : null;

  return (
    <>
      {type && title && (
        <DescriptorCurveStyle $variant={type}>{title}</DescriptorCurveStyle>
      )}
    </>
  );
};
