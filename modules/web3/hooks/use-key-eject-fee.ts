import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useKeyEjectFee = () => {
  const { keys } = useSmSDK();

  return useQuery({
    queryKey: ['ics-eject-fee'],
    queryFn: () => keys.getEjectFeePerKey(),
    ...STRATEGY_CONSTANT,
  });
};
