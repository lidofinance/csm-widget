import { SubmitKeysFormInputType } from 'features/create-node-operator/submit-keys-form/context';
import { useFormState } from 'react-hook-form';
import { DepositDataInputHookForm } from 'shared/hook-form/controls/deposit-data-input-hook-form';

export const KeysInput = () => {
  const { errors } = useFormState<SubmitKeysFormInputType>({
    name: 'depositData',
  });
  const error = errors.depositData?.message;

  return <DepositDataInputHookForm error={error} />;
};
