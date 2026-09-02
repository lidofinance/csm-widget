import {
  getCurveIdByOperatorType,
  getOperatorTypeByCurveId,
  MODULE_NAME,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { useConfig } from 'config';
import { getCurveMetadata, getDisplayOperatorType } from 'consts';
import { useModule } from 'modules/web3';
import { useCallback } from 'react';

export const useModuleOperatorTypeGetter = (module?: MODULE_NAME) => {
  const {
    config: { defaultChain },
  } = useConfig();
  const { module: activeModule } = useModule();
  const targetModule = module ?? activeModule;
  return useCallback(
    (curveId: bigint | undefined) =>
      getOperatorTypeByCurveId(defaultChain, targetModule, curveId),
    [defaultChain, targetModule],
  );
};

export const useCurveMetadataGetter = (module?: MODULE_NAME) => {
  const {
    config: { defaultChain },
  } = useConfig();
  const { module: activeModule } = useModule();
  const targetModule = module ?? activeModule;
  return useCallback(
    (curveId: bigint | undefined) =>
      getCurveMetadata(defaultChain, targetModule, curveId),
    [defaultChain, targetModule],
  );
};

export const useModuleOperatorType = (
  curveId: bigint | undefined,
  module?: MODULE_NAME,
) => {
  const getOperatorType = useModuleOperatorTypeGetter(module);
  return getOperatorType(curveId);
};

// Display variant: unmapped-but-defined curve ids classify as CUSTOM_CURVE.
// Use the strict useModuleOperatorType for logic branches.
export const useDisplayOperatorType = (
  curveId: bigint | undefined,
  module?: MODULE_NAME,
) => {
  const {
    config: { defaultChain },
  } = useConfig();
  const { module: activeModule } = useModule();
  const targetModule = module ?? activeModule;
  return getDisplayOperatorType(defaultChain, targetModule, curveId);
};

export const useCurveMetadata = (
  curveId: bigint | undefined,
  module?: MODULE_NAME,
) => {
  const getMetadata = useCurveMetadataGetter(module);
  return getMetadata(curveId);
};

export const useOperatorTypeCurveId = (type: OPERATOR_TYPE | undefined) => {
  const {
    config: { defaultChain },
  } = useConfig();
  return type ? getCurveIdByOperatorType(defaultChain, type) : undefined;
};
