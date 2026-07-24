import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { DkgFilesField } from 'features/idvtc/dkg/components/dkg-files-field';
import { FC } from 'react';
import { useModuleOperatorTypeGetter } from 'shared/hooks';
import { useSubmitKeysFormData } from '../context';

export const DkgFilesSection: FC = () => {
  const { curveId } = useSubmitKeysFormData();
  const getOperatorType = useModuleOperatorTypeGetter();

  if (getOperatorType(curveId) !== OPERATOR_TYPE.CSM_IDVTC) return null;

  return <DkgFilesField />;
};
