import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useRenderedModule } from 'shared/hooks/use-module-meta';
import { useNodeOperator } from './node-operator-provider';

export const useModule = () => {
  const { activeModule } = useNodeOperator();
  const renderedModule = useRenderedModule();
  const currentModule = activeModule ?? renderedModule;
  return {
    module: currentModule,
    isCSM: currentModule === MODULE_NAME.CSM,
    isCSM02: currentModule === MODULE_NAME.CSM_02,
    isCsmFamily:
      currentModule === MODULE_NAME.CSM || currentModule === MODULE_NAME.CSM_02,
    isCM: currentModule === MODULE_NAME.CM,
  };
};
