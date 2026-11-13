import { Description, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { STETH_ROUNDING_THRESHOLD, TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { AmountField } from 'shared/hook-form/fields';
import { bigMax, getTokenDisplayName } from 'utils';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFlow,
  useClaimBondFormData,
} from '../context';
import { getClaimBreakdown } from '../hooks/use-claim-breakdown';

export const AmountInput: FC = () => {
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
  const { coverAmount } = getClaimBreakdown(
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
    <Stack direction="column" gap={16}>
      <SectionTitle title="Enter token amount" />
      <AmountField
        name="amount"
        label={`${getTokenDisplayName(token)} amount`}
        token={token}
        maxValue={maxAmount}
        balance={<FormatToken amount={maxAmount} token={token} />}
        disabled={!maxAmount}
      />
      {coverAmount > STETH_ROUNDING_THRESHOLD && (
        <Description color="secondary">
          <b>Note:</b> <FormatToken amount={coverAmount} token={TOKENS.steth} />{' '}
          of Rewards will compensate for the Insufficient Bond (
          <FormatToken amount={forKeysLockedDeficit} token={TOKENS.steth} />)
          {claimableBondAndRewards > 0n && (
            <>
              .
              <br />
              <FormatToken
                amount={claimableBondAndRewards}
                token={TOKENS.steth}
              />{' '}
              of Rewards is available to claim to Rewards Address.
            </>
          )}
        </Description>
      )}
      {showExcessNote && (
        <Description color="secondary">
          <b>Note:</b> Any unclaimed rewards will be automatically added to your
          Excess Bond
        </Description>
      )}
    </Stack>
  );
};
