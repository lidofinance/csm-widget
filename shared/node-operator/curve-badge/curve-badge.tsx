import { type OperatorType } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { DescriptorCurveStyle } from './styles';

type Props = { type?: OperatorType; noStyle?: boolean };

export const CurveBadge: FC<Props> = ({ type, noStyle }) => {
  const title = type || null;

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
