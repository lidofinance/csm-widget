import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';

export const AddKeysButton = () => {
  return (
    <SubmitButtonHookForm
      disabled={false}
      data-testid="submitKeysBtn"
      errorField="amount"
    >
      Submit
    </SubmitButtonHookForm>
  );
};
