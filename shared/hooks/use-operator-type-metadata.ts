import {
  CurveRef,
  getCurveRefByOperatorType,
  getOperatorTypeByCurveId,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { useConfig } from 'config';
import { getCurveMetadata, getDisplayOperatorType } from 'consts';
import { useCallback, useMemo } from 'react';

const useDefaultChain = () => {
  const {
    config: { defaultChain },
  } = useConfig();
  return defaultChain;
};

export const useModuleOperatorTypeGetter = () => {
  const defaultChain = useDefaultChain();
  return useCallback(
    (curve: CurveRef | undefined) =>
      getOperatorTypeByCurveId(defaultChain, curve),
    [defaultChain],
  );
};

export const useCurveMetadataGetter = () => {
  const defaultChain = useDefaultChain();
  return useCallback(
    (curve: CurveRef | undefined) => getCurveMetadata(defaultChain, curve),
    [defaultChain],
  );
};

export const useModuleOperatorType = (curve: CurveRef | undefined) =>
  useModuleOperatorTypeGetter()(curve);

// Display variant: unmapped-but-defined curves classify as CUSTOM_CURVE.
// Use the strict useModuleOperatorType for logic branches.
export const useDisplayOperatorType = (curve: CurveRef | undefined) =>
  getDisplayOperatorType(useDefaultChain(), curve);

export const useCurveMetadata = (curve: CurveRef | undefined) =>
  useCurveMetadataGetter()(curve);

/** The type's own curve on the default chain; `undefined` while the gate is not deployed there. */
export const useOperatorTypeCurve = <T extends OPERATOR_TYPE>(
  type: T | undefined,
) => {
  const defaultChain = useDefaultChain();
  return useMemo(
    () => (type ? getCurveRefByOperatorType(defaultChain, type) : undefined),
    [defaultChain, type],
  );
};
