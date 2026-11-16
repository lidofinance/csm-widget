import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useLastReportTxHash = () => {
  const sdk = useSmSDK();

  return useQuery({
    queryKey: ['last-report-tx-hash', { module: sdk?.core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      return (await sdk.rewards.getLastReportTransactionHash()) ?? null;
    },
    enabled: !!sdk,
  });
};
