import { FC } from 'react';
import { DescriptorCurveStyle } from './styles';
import { OPERATOR_TYPE } from 'consts';

const TITLES: Record<OPERATOR_TYPE, string> = {
  [OPERATOR_TYPE.PERMISSIONLESS]: 'PL',
  [OPERATOR_TYPE.EARLYADOPTER]: 'EA',
  [OPERATOR_TYPE.ICS]: 'ICS',
  [OPERATOR_TYPE.CUSTOM]: 'CC',
};

export const CurveBadge: FC<{ type?: OPERATOR_TYPE }> = ({ type }) => {
  const title = type ? TITLES[type] : null;

  return (
    <>
      {title && (
        <DescriptorCurveStyle $variant={type}>{title}</DescriptorCurveStyle>
      )}
    </>
  );
};
