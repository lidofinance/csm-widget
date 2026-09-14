import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useModule } from 'modules/web3';

export const useDepositQueueModule = (module?: MODULE_NAME) => {
  const { module: activeModule } = useModule();
  return module ?? activeModule;
};
