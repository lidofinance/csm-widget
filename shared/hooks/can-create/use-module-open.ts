import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK, useSmStatus } from 'modules/web3';

export const useModuleOpen = (module: MODULE_NAME) => {
  const sdk = useSmSDK(module);
  const { data, isPending } = useSmStatus(module);
  return {
    isOpen: !!data?.registered && !data.isPaused,
    // A disabled react-query stays `isPending: true` forever, so only a
    // constructed module may block.
    isPending: !!sdk && isPending,
  };
};
