import { useWatch } from 'react-hook-form';
import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const SubmitButton = () => {
  const [claimRewards, token, amount] = useWatch<
    ClaimBondFormInputType,
    ['claimRewards', 'token', 'amount']
  >({
    name: ['claimRewards', 'token', 'amount'],
  });

  const { isPaused, maxValues } = useClaimBondFormData();
  if (isPaused) {
    return <PausedButton type="Accounting" />;
  }

  const maxWithRewards = maxValues?.[TOKENS.steth][1];
  const isNothingToClaim = !maxWithRewards;
  const isPullRewards = amount !== undefined && amount === 0n && claimRewards;
  const text = isNothingToClaim
    ? 'Nothing to claim'
    : token === TOKENS.eth
      ? 'Request withdrawal to the Rewards Address'
      : isPullRewards
        ? 'Claim rewards to the Bond balance'
        : 'Claim to the Rewards Address';

  return (
    <SubmitButtonHookForm errorField="amount">{text}</SubmitButtonHookForm>
  );
};
