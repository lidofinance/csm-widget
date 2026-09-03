import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { DkgFilesField } from 'features/idvtc/dkg/components/dkg-files-field';
import { FC } from 'react';
import { useModuleOperatorTypeGetter } from 'shared/hooks';
import { useSubmitKeysFormData } from '../context';

export const DkgFilesSection: FC = () => {
  const { curveId, targetModule } = useSubmitKeysFormData();
  // A curveId maps to a different type per module — must match the resolution
  // in useSubmitKeysFlowResolver, or the flow expects files this never asked for.
  const getOperatorType = useModuleOperatorTypeGetter(targetModule);

  if (getOperatorType(curveId) !== OPERATOR_TYPE.CSM_IDVTC) return null;

  return <DkgFilesField />;
};
