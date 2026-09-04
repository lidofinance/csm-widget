import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useCurrentCurve } from 'shared/hooks';
import { Plural } from '../plurals';
import { ShortInlineLoader } from './styles';

export const FaqStrikeLifetime: FC = () => {
  const curve = useCurrentCurve();

  const { data } = useCurveParameters(
    curve,
    (params) => params.strikesConfig.lifetime,
  );

  return data === undefined ? (
    <ShortInlineLoader />
  ) : (
    <Plural value={data} variants={['frame', 'frames']} showValue />
  );
};
