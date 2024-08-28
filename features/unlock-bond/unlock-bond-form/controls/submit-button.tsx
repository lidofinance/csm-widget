import { SubmitButtonHookForm } from 'shared/hook-form/controls';

export const SubmitButton = () => {
  // TODO: disable
  return (
    <SubmitButtonHookForm errorField="amount">
      Compensate locked bond
    </SubmitButtonHookForm>
  );
};
