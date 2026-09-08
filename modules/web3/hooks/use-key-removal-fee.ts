import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { useCurveParameters } from './use-curve-parameters';

export const useKeyRemovalFee = (curve: CurveRef | undefined) =>
  useCurveParameters(curve, (parameters) => parameters.keyRemovalFee);
