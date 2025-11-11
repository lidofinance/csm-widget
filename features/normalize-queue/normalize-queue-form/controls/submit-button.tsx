import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useNormalizeQueueFormData } from '../context';
import { Note } from 'shared/components';

export const SubmitButton = () => {
  const { unqueuedCount } = useNormalizeQueueFormData();

  return (
    <>
      {unqueuedCount ? (
        <>
          <SubmitButtonHookForm>Normalizing queue</SubmitButtonHookForm>

          <Note>Or submit more keys</Note>
        </>
      ) : (
        <SubmitButtonHookForm disabled>
          No need to normalize queue
        </SubmitButtonHookForm>
      )}
    </>
  );
};
