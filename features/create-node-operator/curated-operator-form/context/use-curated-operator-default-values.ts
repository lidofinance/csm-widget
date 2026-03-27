import { useFormDefaultValues } from 'shared/hook-form/form-controller';
import {
  type CuratedOperatorFormInputType,
  type CuratedOperatorFormNetworkData,
} from './types';

export const useCuratedOperatorDefaultValues = () => {
  return useFormDefaultValues<
    CuratedOperatorFormInputType,
    CuratedOperatorFormNetworkData
  >(() => ({
    step: 1,
    gateIndex: undefined,
    rewardAddress: undefined,
    managerAddress: undefined,
    name: '',
    description: '',
  }));
};
