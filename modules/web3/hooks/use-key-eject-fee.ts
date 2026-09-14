import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useKeyEjectFee = () => {
  const { keys, core } = useSmSDK();

  return useQuery({
    queryKey: ['ics-eject-fee', { module: core.moduleName }],
    queryFn: () => keys.getEjectFeePerKey(),
    ...STRATEGY_CONSTANT,
  });
};
