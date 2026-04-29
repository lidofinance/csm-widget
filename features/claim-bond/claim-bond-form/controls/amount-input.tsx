import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import { FormTitle, Note } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFlow,
  useClaimBondFormData,
} from '../context';
import { getMaxValues } from '../context/get-max-values';
import { useInsufficientBondCoverAmount } from '../hooks/use-insufficient-bond-cover-amount';

export const AmountInput: React.FC = () => {
  const [token, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption']
  >({ name: ['token', 'claimOption'] });
  const flow = useClaimBondFlow();
  const { bond, rewards, poolData, feeSplits } = useClaimBondFormData(true);

  const coverInsufficientAmount = useInsufficientBondCoverAmount();
  const hasNoExcess = !bond.isInsufficient && bond.delta === 0n;
  const showExcessNote = hasNoExcess && claimOption === CLAIM_OPTION.ALL_TO_RA;
  const availableAfterCover =
    coverInsufficientAmount && rewards.available > coverInsufficientAmount
      ? rewards.available - coverInsufficientAmount
      : undefined;

  if (flow.action !== 'claim' || !flow.showAmount) return null;
  const maxIdx = flow.maxValueIndex;
  const maxAmount = getMaxValues({
    bond,
    rewards,
    poolData,
    feeSplits,
  })?.[token][maxIdx];

  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={token}
        maxValue={maxAmount}
        disabled={!maxAmount}
      />
      {!!coverInsufficientAmount && (
        <Note>
          <FormatToken amount={coverInsufficientAmount} token={TOKENS.steth} />{' '}
          of Rewards will compensate for the Insufficient Bond (
          <FormatToken amount={bond.delta} token={TOKENS.eth} />)
          {availableAfterCover !== undefined && (
            <>
              <br />
              <FormatToken
                amount={availableAfterCover}
                token={TOKENS.steth}
              />{' '}
              of Rewards is available to claim to Rewards address
            </>
          )}
        </Note>
      )}
      {showExcessNote && (
        <Note>
          Any unclaimed rewards will be automatically added to your Excess Bond.
        </Note>
      )}
    </>
  );
};
