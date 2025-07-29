import { Tooltip } from '@lidofinance/lido-ui';
import {
  useCurveParameters,
  useFrameInfo,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { FC, useCallback } from 'react';
import { formatDate } from 'utils';
import { Stack } from '../stack';
import { Circle } from './styles';

export const KeyStrikes: FC<{ strikes: number[] }> = ({ strikes }) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  const { data: params } = useCurveParameters(curveId);
  const { data: info } = useFrameInfo();

  const getTooltip = useCallback(
    (n: number) => {
      if (!info || !params) return null;
      const strikeTimestamp =
        info.lastReport - info.frameDuration * (strikes.length - n - 1);
      const expireTimestamp =
        strikeTimestamp + params.strikesConfig.lifetime * info.frameDuration;
      return info ? (
        <>
          Received: {formatDate(strikeTimestamp, 'dd.MM.yyyy')}
          <br />
          Expires: {formatDate(expireTimestamp, 'dd.MM.yyyy')}
        </>
      ) : null;
    },
    [info, params, strikes.length],
  );

  return (
    <Stack gap="xs">
      {strikes.map((s, i) => (
        <span key={i}>
          {s ? (
            <Tooltip placement="top" title={getTooltip(i)}>
              <Circle $red />
            </Tooltip>
          ) : (
            <Circle />
          )}
        </span>
      ))}
    </Stack>
  );
};
