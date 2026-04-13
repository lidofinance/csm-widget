import { useWatch } from 'react-hook-form';
import { FormTitle, Note } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFormData,
  optionMaxValueIndex,
  optionShowsTokenAmount,
} from '../context';
import { useInsufficientBondCoverAmount } from '../hooks/use-insufficient-bond-cover-amount';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const AmountInput: React.FC = () => {
  const [token, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption']
  >({ name: ['token', 'claimOption'] });
  const { bond, rewards, maxValues } = useClaimBondFormData(true);
  const maxAmount = maxValues[token][optionMaxValueIndex(claimOption)];

  const coverInsufficientAmount = useInsufficientBondCoverAmount();
  const hasNoExcess = !bond.isInsufficient && bond.delta === 0n;
  const showExcessNote =
    hasNoExcess && claimOption === CLAIM_OPTION.REWARDS_TO_RA;
  const availableAfterCover =
    coverInsufficientAmount && rewards.available > coverInsufficientAmount
      ? rewards.available - coverInsufficientAmount
      : undefined;

  const showTokenAmount = optionShowsTokenAmount(claimOption);
  if (!showTokenAmount) return null;

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
