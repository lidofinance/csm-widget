import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useNormalizeQueueFlow } from '../context';
import { Note } from 'shared/components';

export const SubmitButton = () => {
  const flow = useNormalizeQueueFlow();

  return (
    <>
      {flow.action === 'normalize' ? (
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
