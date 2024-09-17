import { Note } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useAddKeysFormData } from '../context';

export const SubmitButton = () => {
  const { keysUploadLimit } = useAddKeysFormData();

  const keysLimitReached = keysUploadLimit === 0;

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
          You have reached the upload limit of 10 keys. You cannot upload more.
        </Note>
      )}
    </>
  );
};
