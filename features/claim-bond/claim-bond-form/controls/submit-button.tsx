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

  const { isPaused } = useClaimBondFormData(true);
  if (isPaused) {
    return <PausedButton type="Accounting" />;
  }

  const text =
    claimOption === CLAIM_OPTION.COMPENSATE
      ? 'Compensate'
      : claimOption === CLAIM_OPTION.REWARDS_TO_BOND
        ? 'Claim rewards to the Bond balance'
        : token === TOKENS.eth
          ? 'Request withdrawal'
          : 'Claim';

  return <SubmitButtonHookForm>{text}</SubmitButtonHookForm>;
};
