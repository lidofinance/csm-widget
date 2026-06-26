import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from './node-operator-provider';

export const useModule = () => {
  const { activeModule } = useNodeOperator();
  return {
    module: activeModule,
    isCSM: activeModule === MODULE_NAME.CSM,
    isCM: activeModule === MODULE_NAME.CM,
  };
};
