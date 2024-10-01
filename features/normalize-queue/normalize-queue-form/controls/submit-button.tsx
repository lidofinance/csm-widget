import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useNormalizeQueueFormData } from '../context';
import { Note } from 'shared/components';

export const SubmitButton = () => {
  const { info, unqueuedCount } = useNormalizeQueueFormData();

  return (
    <>
      {unqueuedCount ? (
        info?.stuckValidatorsCount ? (
          <>
            <SubmitButtonHookForm disabled>
              You have stuck keys
            </SubmitButtonHookForm>
            <Note>Before normalize queue you need to exit stuck keys</Note>
          </>
        ) : (
          <>
            <SubmitButtonHookForm
              errorField="keysCount"
              disabled={Boolean(info?.stuckValidatorsCount)}
            >
              Normalizing queue
            </SubmitButtonHookForm>

            <Note>Or submit more keys</Note>
          </>
        )
      ) : (
        <SubmitButtonHookForm disabled>
          No need to normalize queue
        </SubmitButtonHookForm>
      )}
    </>
  );
};
