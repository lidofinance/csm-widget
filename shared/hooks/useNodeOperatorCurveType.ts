import { NodeOperatorId } from 'types';
import { useCsmCurveIdDefault } from './useCsmCurveIdDefault';
import { useCsmCurveIdEarlyAdoption } from './useCsmCurveIdEarlyAdoption';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorCurveId } from './useNodeOperatorCurveId';

export const CURVE_TYPE = {
  DEFAULT: 'DEFAULT',
  EA: 'EA',
  CUSTOM: 'CUSTOM',
} as const;

export type CURVE_TYPE = keyof typeof CURVE_TYPE;

export const useNodeOperatorCurveType = (nodeOperatorId?: NodeOperatorId) => {
  const noSwr = useNodeOperatorCurveId(nodeOperatorId);
  const defaultSwr = useCsmCurveIdDefault();
  const eaSwr = useCsmCurveIdEarlyAdoption();

  return useMergeSwr(
    [noSwr, defaultSwr, eaSwr],
    noSwr.data && defaultSwr.data && eaSwr.data
      ? noSwr.data.eq(defaultSwr.data)
        ? CURVE_TYPE.DEFAULT
        : noSwr.data.eq(eaSwr.data)
          ? CURVE_TYPE.EA
          : CURVE_TYPE.CUSTOM
      : null,
  );
};
