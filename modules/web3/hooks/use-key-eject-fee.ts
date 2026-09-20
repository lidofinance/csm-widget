import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useKeyEjectFee = () => {
  const sdk = useSmSDK();

  return useQuery({
    queryKey: ['ics-eject-fee', { module: sdk?.core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.keys.getEjectFeePerKey();
    },
    enabled: !!sdk,
  });
};
