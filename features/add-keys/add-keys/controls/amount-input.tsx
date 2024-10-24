import { useFormState, useWatch } from 'react-hook-form';

import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { TitledAmount } from 'shared/components';
import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { AddKeysFormInputType, useAddKeysFormData } from '../context';

export const AmountInput = () => {
  const [token, bondAmount] = useWatch<
    AddKeysFormInputType,
    ['token', 'bondAmount']
  >({ name: ['token', 'bondAmount'] });
  const { errors } = useFormState<AddKeysFormInputType>();
  const { bond, loading } = useAddKeysFormData();

  return (
    <>
      <InputAmount
        isLocked={true}
        value={bondAmount}
        label={`${getTokenDisplayName(token)} amount`}
        error={errors.bondAmount?.message}
        fullwidth
      />
      <TitledAmount
        title={bond?.isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}
        description={
          bond?.isInsufficient
            ? 'Will be added to the transaction amount'
            : 'Will be subtracted from the transaction amount'
        }
        loading={loading.isBondLoading}
        amount={bond?.delta}
        token={TOKENS.STETH}
      />
    </>
  );
};
