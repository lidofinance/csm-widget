import { useFormState } from 'react-hook-form';
import { DepositDataInputHookForm } from 'shared/hook-form/controls/deposit-data-input-hook-form';
import { SubmitKeysFormInputType } from '../context';

export const KeysInput = () => {
  const { errors } = useFormState<SubmitKeysFormInputType>({
    name: 'depositData',
  });
  const error = errors.depositData?.message;

  return <DepositDataInputHookForm error={error} />;
};
