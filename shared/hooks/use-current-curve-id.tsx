import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
// Deep import on purpose: the feature barrel pulls in pages that import
// shared/hooks, and this file lives in shared/hooks — importing the barrel
// would close the cycle.
import { useOptionalCreateType } from 'features/create-node-operator/create-type-context';
import {
  useDefaultCurveId,
  useModule,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';

// The module a curve id was read against — pair the two when passing either
// downstream, curve ids are only meaningful within their own module.
export const useCurrentCurveModule = () => {
  const { module: activeModule } = useModule();
  const createType = useOptionalCreateType();
  return createType?.module ?? activeModule;
};

export const useCurrentCurveId = (module?: MODULE_NAME) => {
  const { module: activeModule } = useModule();
  const targetModule = module ?? activeModule;
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(nodeOperatorId);
  const createType = useOptionalCreateType();
  // useDefaultCurveId only covers the CSM family; CM has no permissionless
  // gate to fall back to, so pass CSM here and ignore the result for CM.
  const { data: defaultCurveId } = useDefaultCurveId(
    targetModule === MODULE_NAME.CSM_02 ? MODULE_NAME.CSM_02 : MODULE_NAME.CSM,
  );

  if (createType) {
    return module === undefined || module === createType.module
      ? createType.curveId
      : undefined;
  }

  if (targetModule === activeModule && nodeOperatorId !== undefined) {
    return operatorCurveId;
  }

  return targetModule === MODULE_NAME.CM ? undefined : defaultCurveId;
};
