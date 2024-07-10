import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';
import { ClaimRewardsFormInputType } from '../context';
import { useWatch } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';

export const SubmitButton = () => {
  const token = useWatch<ClaimRewardsFormInputType, 'token'>({ name: 'token' });

  return (
    <SubmitButtonHookForm errorField="amount">
      {token === TOKENS.ETH ? 'Request claim' : 'Claim Bond'}
    </SubmitButtonHookForm>
  );
};
