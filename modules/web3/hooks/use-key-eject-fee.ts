import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useKeyEjectFee = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-eject-fee'],
    queryFn: () => csm.keys.getEjectFeePerKey(),
    ...STRATEGY_CONSTANT,
  });
};
