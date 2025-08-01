import {
  useCurveParameters,
  useFrameInfo,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';

type StrikeDates =
  | {
      receivedTimestamp: number;
      expireTimestamp: number;
    }
  | undefined;

type StrikeDatesGetter = (strikeIndex: number) => StrikeDates;

export const useStrikeDates = <T extends number | undefined>(
  strikeIndex: T,
): T extends number ? StrikeDates : StrikeDatesGetter => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  const { data: params } = useCurveParameters(curveId);
  const { data: info } = useFrameInfo();

  const getDates: StrikeDatesGetter = useCallback(
    (strikeIndex: number) => {
      if (!info || !params) return undefined;
      const receivedTimestamp =
        info.lastReport - info.frameDuration * strikeIndex;
      const expireTimestamp =
        receivedTimestamp + params.strikesConfig.lifetime * info.frameDuration;

      return { receivedTimestamp, expireTimestamp };
    },
    [info, params],
  );

  const dates: StrikeDates = useMemo(() => {
    if (strikeIndex !== undefined) return getDates(strikeIndex);
    return undefined;
  }, [getDates, strikeIndex]);

  if (strikeIndex === undefined) {
    return getDates as any;
  } else {
    return dates as any;
  }
};
