import { useCurveParameters } from './use-curve-parameters';

export const useKeyRemovalFee = (curveId?: bigint) => {
  return useCurveParameters(curveId, (parameters) => parameters.keyRemovalFee);
};
