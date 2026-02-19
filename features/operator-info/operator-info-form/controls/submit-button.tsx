import { FC } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useOperatorInfoFormData } from '../context';

export const SubmitButton: FC = () => {
  const { ownerEditsRestricted } = useOperatorInfoFormData(true);

  return (
    <SubmitButtonHookForm
      isLocked={ownerEditsRestricted}
      disabled={ownerEditsRestricted}
    >
      Update operator info
    </SubmitButtonHookForm>
  );
};
