import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useCurrentCurveId } from 'shared/hooks';
import { Plural } from '../plurals';
import { ShortInlineLoader } from './styles';

export const FaqStrikeThreshold: FC = () => {
  const curveId = useCurrentCurveId();

  const { data } = useCurveParameters(
    curveId,
    (params) => params.strikesConfig.threshold,
  );

  return data === undefined ? (
    <ShortInlineLoader />
  ) : (
    <Plural value={data} variants={['strike', 'strikes']} showValue />
  );
};
