import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';

export const SubmitButton = () => {
  return (
    <SubmitButtonHookForm disabled={false} errorField="amount">
      Claim Bond
    </SubmitButtonHookForm>
  );
};
