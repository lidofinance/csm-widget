import { useWatch } from 'react-hook-form';
import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFormData,
} from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const SubmitButton = () => {
  const [claimOption, token] = useWatch<
    ClaimBondFormInputType,
    ['claimOption', 'token']
  >({
    name: ['claimOption', 'token'],
  });

  const { isPaused, bond, rewards } = useClaimBondFormData(true);
  if (isPaused) {
    return <PausedButton type="Accounting" />;
  }

  const isCompensateFlow =
    claimOption === CLAIM_OPTION.REWARDS_TO_BOND &&
    bond.isInsufficient &&
    rewards.available <= bond.delta;

  const text = isCompensateFlow
    ? 'Compensate'
    : claimOption === CLAIM_OPTION.REWARDS_TO_BOND
      ? 'Claim rewards to the Bond balance'
      : token === TOKENS.eth
        ? 'Request withdrawal'
        : 'Claim';

  return <SubmitButtonHookForm>{text}</SubmitButtonHookForm>;
};
