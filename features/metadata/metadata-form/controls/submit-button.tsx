import { FC } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useMetadataFormData } from '../context/metadata-data-provider';

export const SubmitButton: FC = () => {
  const { ownerEditsRestricted } = useMetadataFormData(true);

  return (
    <SubmitButtonHookForm
      isLocked={ownerEditsRestricted}
      disabled={ownerEditsRestricted}
    >
      Save
    </SubmitButtonHookForm>
  );
};
