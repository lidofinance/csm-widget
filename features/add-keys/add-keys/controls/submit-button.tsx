import { Note } from 'shared/components';
import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useAddKeysFormData } from '../context';

export const SubmitButton = () => {
  const { keysUploadLimit, isPaused } = useAddKeysFormData();

  const keysLimitReached = keysUploadLimit === 0;

  if (isPaused) {
    return <PausedButton type="Module" />;
  }

  return (
    <>
      <SubmitButtonHookForm
        errorField="rawDepositData"
        disabled={keysLimitReached}
      >
        {keysLimitReached ? 'Keys limit has reached' : 'Submit keys'}
      </SubmitButtonHookForm>
      {keysLimitReached && (
        <Note>
          You have reached the Early Access upload limit of 10 keys. You cannot
          upload more.
        </Note>
      )}
    </>
  );
};
