import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useLastReportTxHash = () => {
  const { rewards, core } = useSmSDK();

  return useQuery({
    queryKey: ['last-report-tx-hash', { module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => (await rewards.getLastReportTransactionHash()) ?? null,
  });
};
