import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormTitle, Note } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { useShortageBondCoverAmount } from '../hooks/use-shortage-bond-cover-amount';

export const AmountInput: React.FC = () => {
  const [token, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimRewards']
  >({ name: ['token', 'claimRewards'] });
  const { maxValues } = useClaimBondFormData();
  const maxAmount = maxValues?.[token][Number(claimRewards)];

  const coverShortageAmount = useShortageBondCoverAmount();

  // TODO: reset amount on token switch, on disabled
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={token}
        maxValue={maxAmount}
        disabled={maxAmount?.eq(0)}
      />
      {coverShortageAmount && (
        <Note text="of Rewards will compensate for the Shortage bond">
          <FormatToken amount={coverShortageAmount} token={TOKENS.STETH} />
        </Note>
      )}
    </>
  );
};
