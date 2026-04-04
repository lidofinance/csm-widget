import { PATH } from 'consts';
import { WarningBlock } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { LocalLink } from 'shared/navigate';
import { useUnlockBondFormData } from '../context';

export const SubmitButton = () => {
  const { isExpired, compensationAmount } = useUnlockBondFormData();

  if (!isExpired && !compensationAmount)
    return (
      <WarningBlock type="notice">
        Your bond is insufficient to compensate the locked amount. Please{' '}
        <LocalLink href={PATH.BOND_ADD}>top up the bond</LocalLink> first.
      </WarningBlock>
    );

  return (
    <SubmitButtonHookForm>
      {isExpired ? 'Unlock bond' : 'Compensate locked bond'}
    </SubmitButtonHookForm>
  );
};
