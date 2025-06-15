import { FC } from 'react';
import { DescriptorCurveStyle } from './styles';
import { OPERATOR_TYPE } from 'consts';

const TITLES: Record<OPERATOR_TYPE, string> = {
  [OPERATOR_TYPE.PERMISSIONLESS]: 'PLS',
  [OPERATOR_TYPE.EARLYADOPTER]: 'LEA',
  [OPERATOR_TYPE.ICS]: 'ICS',
  [OPERATOR_TYPE.CUSTOM]: 'CC',
};

type Props = { type?: OPERATOR_TYPE; noStyle?: boolean };

export const CurveBadge: FC<Props> = ({ type, noStyle }) => {
  const title = type ? TITLES[type] : null;

  return (
    <>
      {title && (
        <DescriptorCurveStyle $variant={noStyle ? undefined : type}>
          {title}
        </DescriptorCurveStyle>
      )}
    </>
  );
};
