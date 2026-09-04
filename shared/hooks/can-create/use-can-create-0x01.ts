import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useCanCreateDefaultType } from './use-can-create-default-type';

export const useCanCreate0x01 = () => useCanCreateDefaultType(MODULE_NAME.CSM);
