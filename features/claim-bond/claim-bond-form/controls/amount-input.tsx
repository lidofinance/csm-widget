import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import { FormTitle, Note } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import { bigMax } from 'utils';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFlow,
  useClaimBondFormData,
} from '../context';
import { computeClaimBreakdown } from '../hooks/use-claim-breakdown';

export const AmountInput: React.FC = () => {
  const [token, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption']
  >({ name: ['token', 'claimOption'] });
  const flow = useClaimBondFlow();
  const data = useClaimBondFormData(true);
  const {
    bond,
    calculation: {
      realExcess,
      realInsufficient,
      claimableBondAndRewards,
      claimableMaxValues,
    },
  } = data;

  // amount-independent fields only — pass 0n to skip toRA/bondDelta computation.
  const { coverAmount } = computeClaimBreakdown(
    { token, amount: 0n, claimOption },
    data,
  );
  const forKeysLockedDeficit = bigMax(
    0n,
    bond.required + bond.locked - bond.current,
  );
  const showExcessNote =
    realExcess === 0n &&
    realInsufficient === 0n &&
    claimOption === CLAIM_OPTION.ALL_TO_RA;

  if (flow.action !== 'claim' || !flow.showAmount) return null;
  const maxAmount = claimableMaxValues?.[token][flow.maxValueIndex];

  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={token}
        maxValue={maxAmount}
        disabled={!maxAmount}
      />
      {coverAmount > 0n && (
        <Note>
          <FormatToken amount={coverAmount} token={TOKENS.steth} /> of Rewards
          will compensate for the Insufficient Bond (
          <FormatToken amount={forKeysLockedDeficit} token={TOKENS.steth} />)
          {claimableBondAndRewards > 0n && (
            <>
              <br />
              <FormatToken
                amount={claimableBondAndRewards}
                token={TOKENS.steth}
              />{' '}
              is available to claim to Rewards Address
            </>
          )}
        </Note>
      )}
      {showExcessNote && (
        <Note>
          Any unclaimed rewards will be automatically added to your Excess Bond
        </Note>
      )}
    </>
  );
};
