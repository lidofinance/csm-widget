import { Note } from 'shared/components';
import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useKeysTotalLimit } from 'shared/hooks';
import { useAddKeysFormData } from '../context';

export const SubmitButton = () => {
  const { keysUploadLimit, isPaused } = useAddKeysFormData();
  const { data: keysTotalLimit } = useKeysTotalLimit();

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
        {keysLimitReached ? 'Keys limit has been reached' : 'Submit keys'}
      </SubmitButtonHookForm>
      {keysLimitReached && keysTotalLimit && (
        <Note>
          You have reached the Early Access upload limit of {keysTotalLimit}{' '}
          keys. You cannot upload more.
        </Note>
      )}
    </>
  );
};
