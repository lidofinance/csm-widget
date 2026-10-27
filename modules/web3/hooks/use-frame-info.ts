import { FrameInfo, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useTargetSmSDK } from '../web3-provider';
import { formatDate, isDayInPast } from 'utils';

export const useFrameInfo = <TData = FrameInfo>(
  select?: (data: FrameInfo) => TData,
  module?: MODULE_NAME,
) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['frame-info', { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.frame.getInfo();
    },
    enabled: !!sdk,
    select,
  });
};

export const getNextDistribution = (data: FrameInfo) =>
  isDayInPast(data.nextReport) ? 'soon' : `on ${formatDate(data.nextReport)}`;
