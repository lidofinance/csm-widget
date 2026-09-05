import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { DkgFilesField } from 'features/idvtc/dkg/components/dkg-files-field';
import { FC } from 'react';
import { useSubmitKeysFormData } from '../context';

export const DkgFilesSection: FC = () => {
  const { type } = useSubmitKeysFormData();

  if (type !== OPERATOR_TYPE.CSM_IDVTC) return null;

  return <DkgFilesField />;
};
