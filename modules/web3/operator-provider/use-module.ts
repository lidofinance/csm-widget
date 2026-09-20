import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from './node-operator-provider';

export const useModule = () => {
  const { activeModule: module } = useNodeOperator();
  return {
    module,
    isCSM: module === MODULE_NAME.CSM,
    isCSM02: module === MODULE_NAME.CSM_02,
    isCsmFamily: module === MODULE_NAME.CSM || module === MODULE_NAME.CSM_02,
    isCM: module === MODULE_NAME.CM,
  };
};
