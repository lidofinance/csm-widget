import { SubmitButtonHookForm } from 'shared/hook-form/controls';

export const SubmitButton = () => {
  // TODO: disable
  return (
    <SubmitButtonHookForm errorField="amount">
      Report stealing
    </SubmitButtonHookForm>
  );
};
