import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useTransferKeysFormData } from '../context';
import { Plural } from 'shared/components';

export const SubmitButton = () => {
  const { keysToMigrate, needCleanup } = useTransferKeysFormData();

  return (
    <SubmitButtonHookForm errorField="selection">
      {needCleanup ? (
        <>
          Transfer{' '}
          <Plural variants={['key', 'keys']} value={keysToMigrate} showValue />{' '}
          and cleanup
        </>
      ) : (
        <>
          Transfer{' '}
          <Plural variants={['key', 'keys']} value={keysToMigrate} showValue />{' '}
        </>
      )}
    </SubmitButtonHookForm>
  );
};
