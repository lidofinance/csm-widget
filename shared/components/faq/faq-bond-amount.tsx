import { CurveParameters, TOKENS } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE } from 'consts';
import { getOperatorType, KNOWN_TYPES, useCurveParameters } from 'modules/web3';
import { FC, useCallback } from 'react';
import { FormatToken } from 'shared/formatters';
import { useCurrentCurveId } from 'shared/hooks';
import { ShortInlineLoader } from './styles';

type Props = {
  type?: OPERATOR_TYPE;
  second?: boolean;
};
getOperatorType;

export const FaqBondAmount: FC<Props> = ({ type, second }) => {
  const _curveId = useCurrentCurveId();
  const curveId = (type && KNOWN_TYPES[type]) ?? _curveId;

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
