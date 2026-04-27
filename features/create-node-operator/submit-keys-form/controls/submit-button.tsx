import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { SubmitKeysFormInputType, useSubmitKeysFormData } from '../context';
import { useWatch } from 'react-hook-form';

export const SubmitButton = () => {
  const { isPaused } = useSubmitKeysFormData();
  const depositData = useWatch<SubmitKeysFormInputType, 'depositData'>({
    name: 'depositData',
  });

  if (isPaused) {
    return <PausedButton type="Module" />;
  }

  const disabled = !depositData?.length;

  return (
    <SubmitButtonHookForm disabled={disabled}>
      Create Node Operator
    </SubmitButtonHookForm>
  );
};
