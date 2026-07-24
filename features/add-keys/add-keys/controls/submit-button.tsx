import { useWatch } from 'react-hook-form';
import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { AddKeysFormInputType, useAddKeysFormData } from '../context';

export const SubmitButton = () => {
  const { isPaused } = useAddKeysFormData();
  const depositData = useWatch<AddKeysFormInputType, 'depositData'>({
    name: 'depositData',
  });

  if (isPaused) {
    return <PausedButton type="Module" />;
  }

  const disabled = !depositData?.length;

  return (
    <SubmitButtonHookForm disableIfClean disabled={disabled}>
      {'Submit keys'}
    </SubmitButtonHookForm>
  );
};
