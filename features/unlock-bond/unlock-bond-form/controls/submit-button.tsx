import { SubmitButtonHookForm } from 'shared/hook-form/controls';

export const SubmitButton = () => {
  return (
    <SubmitButtonHookForm errorField="amount">
      Compensate locked bond
    </SubmitButtonHookForm>
  );
};
