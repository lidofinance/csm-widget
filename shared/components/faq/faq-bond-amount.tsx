import {
  CurveParameters,
  OPERATOR_TYPE,
  OPERATOR_TYPE_MODULE,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { useCurveParameters } from 'modules/web3';
import { FC, useCallback } from 'react';
import { FormatToken } from 'shared/formatters';
import { useCurrentCurveId, useOperatorTypeCurveId } from 'shared/hooks';
import { ShortInlineLoader } from './styles';

type Props = {
  type?: OPERATOR_TYPE;
  second?: boolean;
};

export const FaqBondAmount: FC<Props> = ({ type, second }) => {
  const _curveId = useCurrentCurveId();
  const typeCurveId = useOperatorTypeCurveId(type);
  const curveId = type ? typeCurveId : _curveId;

  const select = useCallback(
    ({ bondConfig }: CurveParameters) => {
      const index = second ? Math.min(1, bondConfig.length - 1) : 0;
      return bondConfig[index].value;
    },
    [second],
  );

  // A type-scoped curve id only exists in that type's own module: reading it
  // against the active operator's module reverts (e.g. CSM ICS curve on CSM_02).
  const { data, isPending } = useCurveParameters(
    curveId,
    select,
    type && OPERATOR_TYPE_MODULE[type],
  );

  return isPending ? (
    <ShortInlineLoader />
  ) : (
    <FormatToken amount={data} token={TOKENS.eth} maxDecimalDigits={2} />
  );
};
