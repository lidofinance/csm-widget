import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useCurrentCurveId } from 'shared/hooks';
import { Plural } from '../plurals/plural';
import { ShortInlineLoader } from './styles';

export const FaqStrikeLifetime: FC = () => {
  const curveId = useCurrentCurveId();

  const { data } = useCurveParameters(
    curveId,
    (params) => params.strikesConfig.lifetime,
  );

  return data === undefined ? (
    <ShortInlineLoader />
  ) : (
    <Plural value={data} variants={['frame', 'frames']} showValue />
  );
};
