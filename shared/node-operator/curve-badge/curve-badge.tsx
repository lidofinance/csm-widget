import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { DescriptorCurveStyle } from './styles';
import { OPERATOR_TYPE_METADATA } from 'consts';

type Props = { type?: OPERATOR_TYPE; noStyle?: boolean; inline?: boolean };

export const CurveBadge: FC<Props> = ({ type, noStyle, inline }) => {
  const title = type ? OPERATOR_TYPE_METADATA[type]?.short : null;

  if (!title) return null;

  return (
    <DescriptorCurveStyle
      $variant={noStyle ? undefined : type}
      $inline={inline}
    >
      {title}
    </DescriptorCurveStyle>
  );
};
