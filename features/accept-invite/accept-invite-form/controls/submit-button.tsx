import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';

export const SubmitButton = () => {
  return (
    <SubmitButtonHookForm errorField="invite">
      Accept request
    </SubmitButtonHookForm>
  );
};
