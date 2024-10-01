import { FormTitle, Note } from 'shared/components';
import { useRemoveKeysFormData } from '../context';
import { KeysSelectorHookForm } from 'shared/hook-form/controls';

export const KeysSelector = () => {
  const { keys } = useRemoveKeysFormData();

  return (
    <>
      <FormTitle>Choose keys to remove</FormTitle>
      <KeysSelectorHookForm options={keys || []} />
      <Note>Your choice has to be a sequential array</Note>
    </>
  );
};
