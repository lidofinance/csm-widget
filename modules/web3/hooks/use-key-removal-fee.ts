import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useCurveParameters } from './use-curve-parameters';

export const useKeyRemovalFee = (
  curveId: bigint | undefined,
  module?: MODULE_NAME,
) => {
  return useCurveParameters(
    curveId,
    (parameters) => parameters.keyRemovalFee,
    module,
  );
};
