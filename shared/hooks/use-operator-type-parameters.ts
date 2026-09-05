import { CurveParameters, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { useCurveParameters } from 'modules/web3';
import { useOperatorTypeCurve } from './use-operator-type-metadata';

/** Parameters of a type's own curve, always read from the module that owns the type. */
export const useOperatorTypeParameters = <TData = CurveParameters>(
  type: OPERATOR_TYPE | undefined,
  select?: (data: CurveParameters) => TData,
) => useCurveParameters(useOperatorTypeCurve(type), select);
