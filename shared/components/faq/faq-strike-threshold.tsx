import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useCurrentCurve } from 'shared/hooks';
import { Plural } from '../plurals';
import { ShortInlineLoader } from './styles';

export const FaqStrikeThreshold: FC = () => {
  const curve = useCurrentCurve();

  const { data } = useCurveParameters(
    curve,
    (params) => params.strikesConfig.threshold,
  );

  return data === undefined ? (
    <ShortInlineLoader />
  ) : (
    <Plural value={data} variants={['strike', 'strikes']} showValue />
  );
};
