import { Input } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle, WarningBlock } from 'shared/components';
import { useMetadataFormData } from '../context/metadata-data-provider';

type InfoProps = {
  restricted?: boolean;
};

export const Info: FC<InfoProps> = ({ restricted }) => {
  const { currentName, currentDescription } = useMetadataFormData(true);

  return (
    <>
      <FormTitle>Node Operator name</FormTitle>
      <Input disabled value={currentName || '—'} label="Name" />
      <Input disabled value={currentDescription || '—'} label="Description" />
      {restricted && (
        <WarningBlock type="warning">
          Editing is currently disabled. Contact the NOM team or CMC for
          assistance.
        </WarningBlock>
      )}
    </>
  );
};
