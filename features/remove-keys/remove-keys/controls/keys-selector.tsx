import { FormTitle, Note } from 'shared/components';
import { useRemoveKeysFormData } from '../context';
import { KeysSelectorHookForm } from 'shared/hook-form/controls/keys-selector-hook-form';

export const KeysSelector = () => {
  const { keys } = useRemoveKeysFormData();

  return (
    <>
      <FormTitle>Choose keys to remove</FormTitle>
      <KeysSelectorHookForm options={keys || []} />
      <Note text="Your choice has to be a sequential array" />
    </>
  );
};
