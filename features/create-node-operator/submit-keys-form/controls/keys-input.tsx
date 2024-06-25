import { useFormState } from 'react-hook-form';
import { DepositDataInputHookForm } from 'shared/hook-form/controls/deposit-data-input-hook-form';
import { SubmitKeysFormInputType } from '../context';
import { FormTitle } from 'shared/components';
import { Link } from '@lidofinance/lido-ui';

export const KeysInput = () => {
  const { errors } = useFormState<SubmitKeysFormInputType>({
    name: 'depositData',
  });
  const error = errors.depositData?.message;

  return (
    <>
      <FormTitle>
        Upload deposit data
        <Link href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm-wip/generating-csm-keystores">
          Learn more
        </Link>
      </FormTitle>
      <DepositDataInputHookForm error={error} />
    </>
  );
};
