import { NodeOperatorId } from 'types';
import { useCsmCurveIdDefault } from './useCsmCurveIdDefault';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorCurveId } from './useNodeOperatorCurveId';

export const CURVE_TYPE = {
  DEFAULT: 'DEFAULT',
  CUSTOM: 'CUSTOM',
} as const;

export type CURVE_TYPE = keyof typeof CURVE_TYPE;

export const useNodeOperatorCurveType = (nodeOperatorId?: NodeOperatorId) => {
  const noSwr = useNodeOperatorCurveId(nodeOperatorId);
  const defaultSwr = useCsmCurveIdDefault();

  return useMergeSwr(
    [noSwr, defaultSwr],
    noSwr.data && defaultSwr.data
      ? noSwr.data.eq(defaultSwr.data)
        ? CURVE_TYPE.DEFAULT
        : CURVE_TYPE.CUSTOM
      : null,
  );
};
