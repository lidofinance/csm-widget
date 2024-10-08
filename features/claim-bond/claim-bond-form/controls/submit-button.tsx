import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { useWatch } from 'react-hook-form';

export const SubmitButton = () => {
  const claimRewards = useWatch<ClaimBondFormInputType, 'claimRewards'>({
    name: 'claimRewards',
  });

  const { isPaused } = useClaimBondFormData();
  if (isPaused) {
    return <PausedButton type="Accounting" />;
  }

  // TODO: disable
  // TODO: nothing to claim
  return (
    <SubmitButtonHookForm errorField="amount">
      {claimRewards ? 'Claim Rewards and Bond' : 'Claim Bond'}
    </SubmitButtonHookForm>
  );
};
