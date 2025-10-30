import {
  CurveParameters,
  OPERATOR_TYPE,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { useCurveParameters } from 'modules/web3';
import { FC, useCallback } from 'react';
import { FormatToken } from 'shared/formatters';
import { useCurrentCurveId } from 'shared/hooks';
import { getCurveIdByOperatorType } from 'utils';
import { ShortInlineLoader } from './styles';

type Props = {
  type?: OPERATOR_TYPE;
  second?: boolean;
};

export const FaqBondAmount: FC<Props> = ({ type, second }) => {
  const _curveId = useCurrentCurveId();
  const curveId = getCurveIdByOperatorType(type) ?? _curveId;

  const select = useCallback(
    ({ bondConfig }: CurveParameters) => {
      const index = second ? Math.min(1, bondConfig.length - 1) : 0;
      return bondConfig[index].value;
    },
    [second],
  );

  const { data, isPending } = useCurveParameters(curveId, select);

  return isPending ? (
    <ShortInlineLoader />
  ) : (
    <FormatToken amount={data} token={TOKENS.eth} maxDecimalDigits={2} />
  );
};
