import { FormTitle, Note } from 'shared/components';
import { RemoveKeysSelectorHookForm } from 'shared/hook-form/controls';
import { useRemoveKeysFormData } from '../context';

export const KeysSelector = () => {
  const { keys } = useRemoveKeysFormData();

  return (
    <>
      <FormTitle>Choose keys to remove</FormTitle>
      <RemoveKeysSelectorHookForm options={keys || []} />
      {keys && keys?.length > 2 && (
        <Note>Your choice has to be a sequential array</Note>
      )}
    </>
  );
};
