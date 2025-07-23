import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useTransferKeysFormData } from '../context';

export const SubmitButton = () => {
  const { keysToMigrate } = useTransferKeysFormData();

  return (
    <SubmitButtonHookForm errorField="selection">
      Transfer {keysToMigrate} keys
    </SubmitButtonHookForm>
  );
};
