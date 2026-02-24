import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { DescriptorCurveStyle } from './styles';
import { OPERATOR_TYPE_METADATA } from 'consts';

type Props = { type?: OPERATOR_TYPE; noStyle?: boolean };

export const CurveBadge: FC<Props> = ({ type, noStyle }) => {
  const title = type ? OPERATOR_TYPE_METADATA[type]?.short : null;

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
