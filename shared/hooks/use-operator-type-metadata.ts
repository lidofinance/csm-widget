import {
  getCurveIdByOperatorType,
  getOperatorTypeByCurveId,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { useConfig } from 'config';
import { getCurveMetadata, getDisplayOperatorType } from 'consts';
import { useCallback } from 'react';

// Stable getter bound to the active chain & module. Prefer it for query
// selects and tx-stage callbacks where identity matters across renders.
export const useModuleOperatorTypeGetter = () => {
  const {
    config: { defaultChain, module },
  } = useConfig();
  return useCallback(
    (curveId: bigint | undefined) =>
      getOperatorTypeByCurveId(defaultChain, module, curveId),
    [defaultChain, module],
  );
};

export const useCurveMetadataGetter = () => {
  const {
    config: { defaultChain, module },
  } = useConfig();
  return useCallback(
    (curveId: bigint | undefined) =>
      getCurveMetadata(defaultChain, module, curveId),
    [defaultChain, module],
  );
};

export const useModuleOperatorType = (curveId: bigint | undefined) => {
  const getOperatorType = useModuleOperatorTypeGetter();
  return getOperatorType(curveId);
};

// Display variant: unmapped-but-defined curve ids classify as CUSTOM_CURVE.
// Use the strict useModuleOperatorType for logic branches.
export const useDisplayOperatorType = (curveId: bigint | undefined) => {
  const {
    config: { defaultChain, module },
  } = useConfig();
  return getDisplayOperatorType(defaultChain, module, curveId);
};

export const useCurveMetadata = (curveId: bigint | undefined) => {
  const getMetadata = useCurveMetadataGetter();
  return getMetadata(curveId);
};

export const useOperatorTypeCurveId = (type: OPERATOR_TYPE | undefined) => {
  const {
    config: { defaultChain },
  } = useConfig();
  return type ? getCurveIdByOperatorType(defaultChain, type) : undefined;
};
