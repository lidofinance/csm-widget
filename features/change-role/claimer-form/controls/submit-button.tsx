import { FC } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';

export const SubmitButton: FC = () => {
  return (
    <SubmitButtonHookForm disableIfClean>
      Set new Rewards Claimer Address
    </SubmitButtonHookForm>
  );
};
