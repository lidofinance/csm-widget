import { Input } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle } from 'shared/components';
import { useMetadataFormData } from '../context/metadata-data-provider';

export const Info: FC = () => {
  const { currentName, currentDescription } = useMetadataFormData(true);

  return (
    <>
      <FormTitle>Node Operator name</FormTitle>
      <Input disabled value={currentName || '—'} label="Name" />
      <Input disabled value={currentDescription || '—'} label="Description" />
    </>
  );
};
