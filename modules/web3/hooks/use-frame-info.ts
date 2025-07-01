import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { FrameInfo } from '@lidofinance/lido-csm-sdk';

export const useFrameInfo = <TData = FrameInfo>(
  select?: (data: FrameInfo) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['frame-info'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.frame.getInfo(),
    select,
  });
};
