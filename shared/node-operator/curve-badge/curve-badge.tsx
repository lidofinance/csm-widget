import { FC } from 'react';
import { DescriptorCurveStyle } from './styles';
import { OPERATOR_TYPE } from 'consts';

export const CurveBadge: FC<{ type?: OPERATOR_TYPE }> = ({ type }) => {
  const title = type === OPERATOR_TYPE.CUSTOM ? 'CC' : null;

  return (
    <>
      {type && title && (
        <DescriptorCurveStyle $variant={type}>{title}</DescriptorCurveStyle>
      )}
    </>
  );
};
