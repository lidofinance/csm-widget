import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormTitle, Note } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { useInsufficientBondCoverAmount } from '../hooks/use-insufficient-bond-cover-amount';

export const AmountInput: React.FC = () => {
  const [token, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimRewards']
  >({ name: ['token', 'claimRewards'] });
  const { maxValues } = useClaimBondFormData();
  const maxAmount = maxValues?.[token][Number(claimRewards)];

  const coverInsufficientAmount = useInsufficientBondCoverAmount();

  // TODO: reset amount on token switch, on disabled
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="tokenAmount"
        token={token}
        maxValue={maxAmount}
        disabled={maxAmount?.eq(0)}
      />
      {coverInsufficientAmount && (
        <Note>
          <FormatToken amount={coverInsufficientAmount} token={TOKENS.STETH} />{' '}
          of Rewards will compensate for the Insufficient bond
        </Note>
      )}
    </>
  );
};
