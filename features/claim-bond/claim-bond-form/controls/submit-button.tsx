import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';
import { ClaimBondFormInputType } from '../context';
import { useWatch } from 'react-hook-form';

export const SubmitButton = () => {
  const claimRewards = useWatch<ClaimBondFormInputType, 'claimRewards'>({
    name: 'claimRewards',
  });

  // TODO: disable
  // TODO: nothing to claim
  return (
    <SubmitButtonHookForm errorField="amount">
      {claimRewards ? 'Claim Rewards and Bond' : 'Claim Bond'}
    </SubmitButtonHookForm>
  );
};
