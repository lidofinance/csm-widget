import { MulticallResponse } from 'viem';
import { useReadContracts } from 'wagmi';
import { csAccountingConfig, csModuleConfig } from '../generated';

const select = ([isPaused, isAccountingPaused, isPublicRelease]: [
  MulticallResponse<boolean>,
  MulticallResponse<boolean>,
  MulticallResponse<boolean>,
]) =>
  isPaused.error || isAccountingPaused.error || isPublicRelease.error
    ? undefined
    : {
        isPaused: isPaused.result,
        isAccountingPaused: isAccountingPaused.result,
        isPublicRelease: isPublicRelease.result,
      };

export const useCsmStatus = () => {
  return useReadContracts({
    contracts: [
      {
        ...csModuleConfig,
        functionName: 'isPaused',
      },
      {
        ...csAccountingConfig,
        functionName: 'isPaused',
      },
      {
        ...csModuleConfig,
        functionName: 'publicRelease',
      },
    ],
    query: {
      select,
    },
  });
};
