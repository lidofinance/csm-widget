import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useCurrentCurve } from 'shared/hooks';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './styles';

export const FaqPerformanceLeeway: FC = () => {
  const curve = useCurrentCurve();
  const { data, isPending } = useCurveParameters(curve, (parameters) => {
    return parameters?.performanceLeewayConfig.at(-1)?.value ?? 500n;
  });

  return isPending ? <ShortInlineLoader /> : <>{formatPercent(data)}</>;
};
