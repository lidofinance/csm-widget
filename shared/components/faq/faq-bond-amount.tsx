import {
  CurveParameters,
  OPERATOR_TYPE,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { useCurveParameters } from 'modules/web3';
import { FC, useCallback } from 'react';
import { FormatToken } from 'shared/formatters';
import { useCurrentCurve, useOperatorTypeCurve } from 'shared/hooks';
import { ShortInlineLoader } from './styles';

type Props = { type?: OPERATOR_TYPE; second?: boolean };

export const FaqBondAmount: FC<Props> = ({ type, second }) => {
  const currentCurve = useCurrentCurve();
  const typeCurve = useOperatorTypeCurve(type);
  const curve = type ? typeCurve : currentCurve;

  const select = useCallback(
    ({ bondConfig }: CurveParameters) => {
      const index = second ? Math.min(1, bondConfig.length - 1) : 0;
      return bondConfig[index].value;
    },
    [second],
  );

  const { data, isPending } = useCurveParameters(curve, select);

  return isPending ? (
    <ShortInlineLoader />
  ) : (
    <FormatToken amount={data} token={TOKENS.eth} maxDecimalDigits={2} />
  );
};
