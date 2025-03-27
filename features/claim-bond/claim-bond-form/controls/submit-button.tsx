import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';

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

  const isNothingToClaim = !!maxValues?.STETH[1]?.isZero();
  const isPullRewards = !!amount?.isZero() && claimRewards;
  const text = isNothingToClaim
    ? 'Nothing to claim'
    : token === TOKENS.ETH
      ? 'Request withdrawal to the Rewards Address'
      : isPullRewards
        ? 'Claim rewards to the Bond balance'
        : 'Claim to the Rewards Address';

  return (
    <SubmitButtonHookForm errorField="amount">{text}</SubmitButtonHookForm>
  );
};
