import { useCurveParameters } from './use-curve-parameters';

export const useKeyRemovalFee = (curveId: bigint | undefined) => {
  return useCurveParameters(curveId, (parameters) => parameters.keyRemovalFee);
};

export const useWithdrawalRequestFee = (curveId: bigint | undefined) => {
  return useCurveParameters(
    curveId,
    (parameters) => parameters.maxWithdrawalRequestFee,
  );
};
