import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormTitle, Note } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
import { ClaimBondFormInputType } from '../context';
import { useShortageBondCoverAmount } from '../hooks/use-shortage-bond-cover-amount';
import { useMaxClaimValue } from '../hooks/use-max-claim-value';

export const AmountInput: React.FC = () => {
  const token = useWatch<ClaimBondFormInputType, 'token'>({ name: 'token' });
  const max = useMaxClaimValue();

  const coverShortageAmount = useShortageBondCoverAmount();

  // TODO: reset amount on token switch, on disabled
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={token}
        maxValue={max[token]}
        disabled={max[token]?.eq(0)}
      />
      {coverShortageAmount && (
        <Note text="of Rewards will compensate for the Shortage bond">
          <FormatToken amount={coverShortageAmount} token={TOKENS.STETH} />
        </Note>
      )}
    </>
  );
};
