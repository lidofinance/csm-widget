import {
  CurveRef,
  MODULE_NAME,
  OPERATOR_TYPE_INFO,
} from '@lidofinance/lido-csm-sdk';
import {
  useDefaultCurveId,
  useModule,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';
import { useCreateType } from 'providers/create-type-provider';
import { useOperatorTypeCurve } from './use-operator-type-metadata';

/** Module whose curve the page is about: the type being created, else the active module. */
export const useCurrentCurveModule = (): MODULE_NAME => {
  const { module: activeModule } = useModule();
  const createType = useCreateType();
  return createType ? OPERATOR_TYPE_INFO[createType].module : activeModule;
};

/** The curve the page is about: create-flow type curve, else the active operator's, else the module default. */
export const useCurrentCurve = (): CurveRef | undefined => {
  const { module: activeModule } = useModule();
  const { nodeOperator } = useNodeOperator();
  const { data: operatorCurve } = useOperatorCurveId(nodeOperator);
  const createType = useCreateType();
  const createCurve = useOperatorTypeCurve(createType);
  // useDefaultCurveId only covers the CSM family; CM has no permissionless
  // gate to fall back to, so pass CSM here and ignore the result for CM.
  const { data: defaultCurve } = useDefaultCurveId(
    activeModule === MODULE_NAME.CSM_02 ? MODULE_NAME.CSM_02 : MODULE_NAME.CSM,
  );

  if (createType) return createCurve;
  if (nodeOperator) return operatorCurve;
  return activeModule === MODULE_NAME.CM ? undefined : defaultCurve;
};
