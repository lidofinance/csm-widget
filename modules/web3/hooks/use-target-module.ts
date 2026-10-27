import { OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import { useCreateType } from 'providers/create-type-provider';
import { useModule } from '../operator-provider/use-module';

/** Module a form acts on: the type being created, else the active operator's. */
export const useTargetModule = () => {
  const createType = useCreateType();
  const { module } = useModule();
  return createType ? OPERATOR_TYPE_INFO[createType].module : module;
};
