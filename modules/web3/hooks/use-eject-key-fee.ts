import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useEjectKeyFee = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-eject-fee'],
    queryFn: () => csm.keys.getEjectFeePerKey(),
    ...STRATEGY_CONSTANT,
  });
};
