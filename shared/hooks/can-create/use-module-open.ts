import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { useSmStatus } from 'modules/web3';

export const useModuleOpen = (module: MODULE_NAME) => {
  const { data, isPending } = useSmStatus(module);
  return {
    isOpen: !!data?.registered && !data.isPaused,
    // A disabled react-query stays `isPending: true` forever, so only a
    // configured module may block.
    isPending: deployedModules.includes(module) && isPending,
  };
};
