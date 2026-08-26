import { MODULE_NAME, OPERATOR_TYPE_MODULE } from '@lidofinance/lido-csm-sdk';
import {
  useCanCreateNodeOperator,
  useRequestedOperatorType,
} from 'shared/hooks';

const CSM_FAMILY: MODULE_NAME[] = [MODULE_NAME.CSM, MODULE_NAME.CSM_02];

// CM creates go through curated-operator-form; this form is CSM-family only.
export const useTargetModule = (): MODULE_NAME.CSM | MODULE_NAME.CSM_02 => {
  const { type } = useRequestedOperatorType();
  const { creatableModules } = useCanCreateNodeOperator();

  if (type) {
    return OPERATOR_TYPE_MODULE[type] === MODULE_NAME.CSM_02
      ? MODULE_NAME.CSM_02
      : MODULE_NAME.CSM;
  }

  const creatableCsmFamily = creatableModules.filter((module) =>
    CSM_FAMILY.includes(module),
  );
  return creatableCsmFamily.length === 1 &&
    creatableCsmFamily[0] === MODULE_NAME.CSM_02
    ? MODULE_NAME.CSM_02
    : MODULE_NAME.CSM;
};
