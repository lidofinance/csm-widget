import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useCanCreateDefaultType } from './use-can-create-default-type';

export const useCanCreate0x02 = () =>
  useCanCreateDefaultType(MODULE_NAME.CSM_02);
