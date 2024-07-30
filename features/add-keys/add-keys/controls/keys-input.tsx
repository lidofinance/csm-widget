import { Link } from '@lidofinance/lido-ui';
import { useFormState } from 'react-hook-form';
import { FormTitle } from 'shared/components';
import { DepositDataInputHookForm } from 'shared/hook-form/controls';
import { AddKeysFormInputType } from '../context';

export const KeysInput = () => {
  const { errors } = useFormState<AddKeysFormInputType>({
    name: ['depositData', 'rawDepositData'],
  });
  const error = errors.rawDepositData?.message || errors.depositData?.message;

  return (
    <>
      <FormTitle>
        Upload deposit data
        <Link href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm">
          Learn more
        </Link>
      </FormTitle>
      <DepositDataInputHookForm error={error} />
    </>
  );
};
