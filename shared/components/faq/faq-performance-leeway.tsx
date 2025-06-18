import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useCurrentCurveId } from 'shared/hooks';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './styles';

export const FaqPerformanceLeeway: FC = () => {
  const curveId = useCurrentCurveId();
  const { data, isPending } = useCurveParameters(curveId, (parameters) => {
    return parameters?.performanceLeewayConfig.at(-1)?.value ?? 500n;
  });

  formatPercent;
  return isPending ? <ShortInlineLoader /> : <>{formatPercent(data)}</>;
};
