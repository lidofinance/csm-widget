import { Text } from '@lidofinance/lido-ui';
import {
  useNodeOperatorId,
  useOperatorCurveId,
  useCurveParameters,
  useFrameInfo,
} from 'modules/web3';
import { FC } from 'react';
import { formatDate } from 'utils';

export const LastStrike: FC<{ strikes: number[] }> = ({ strikes }) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  const { data: params } = useCurveParameters(curveId);
  const { data: info } = useFrameInfo();

  if (!info || !params) return null;

  const n = strikes.findLastIndex((v) => !!v);
  const strikeTimestamp =
    info.lastReport - info.frameDuration * (strikes.length - n - 1);

  return (
    <Text size="xs" color="secondary">
      Last Strike: {formatDate(strikeTimestamp, 'dd.MM.yyyy')}
    </Text>
  );
};
