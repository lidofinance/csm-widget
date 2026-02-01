import { FrameInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useFrameInfo = <TData = FrameInfo>(
  select?: (data: FrameInfo) => TData,
) => {
  const { frame } = useSmSDK();

  return useQuery({
    queryKey: ['frame-info'],
    ...STRATEGY_CONSTANT,
    queryFn: () => frame.getInfo(),
    select,
  });
};
