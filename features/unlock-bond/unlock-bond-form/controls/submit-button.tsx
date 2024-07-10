import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';

export const SubmitButton = () => {
  // TODO: disable
  return (
    <SubmitButtonHookForm errorField="amount">
      Compensate locked bond
    </SubmitButtonHookForm>
  );
};
