import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';
import { ClaimBondFormInputType } from '../context';
import { useWatch } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';

export const SubmitButton = () => {
  const token = useWatch<ClaimBondFormInputType, 'token'>({ name: 'token' });

  return (
    <SubmitButtonHookForm disabled={false} errorField="amount">
      {token === TOKENS.ETH ? 'Request claim' : 'Claim Bond'}
    </SubmitButtonHookForm>
  );
};
