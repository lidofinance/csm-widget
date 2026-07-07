import { Accordion, Block, Text } from '@lidofinance/lido-ui';
import { useClaimBondFormData } from 'features/claim-bond/claim-bond-form/context';
import { type CLAIM_OPTION } from 'features/claim-bond/claim-bond-form/context/types';
import { FC } from 'react';
import styled from 'styled-components';
import { formatEther } from 'viem';

const f = (v?: bigint) => formatEther(v ?? 0n);

// Reads the derived network data straight from the form's context, so the panel
// shows exactly what the rendered form computed (no parallel re-derivation), and
// cross-checks the real availableOptions against the scenario's expectation.
export const ClaimBondDebugPanel: FC<{
  expectOptions?: CLAIM_OPTION[];
  expectEmpty?: boolean;
}> = ({ expectOptions, expectEmpty }) => {
  const data = useClaimBondFormData();

  if (!data?.bond || !data.calculation) return null;

  const {
    bond,
    rewards,
    calculation: c,
    availableOptions = [],
    feeSplits = [],
    isPaused,
    isContract,
  } = data;

  const actual = [...availableOptions].sort().join(', ') || '—';
  const expected = expectEmpty
    ? '—'
    : [...(expectOptions ?? [])].sort().join(', ') || '—';
  const hasExpectation = expectEmpty || !!expectOptions;
  const match = !hasExpectation || actual === expected;

  return (
    <TestBlock>
      <StyledAccordion
        summary={
          <Text size="xs" color="secondary">
            Raw inputs &amp; derived calculation{' '}
            {match ? '✓' : '✗ options mismatch'}
          </Text>
        }
      >
        <DataPre>
          {[
            `current:                 ${f(bond.current)}`,
            `required (forKeys):      ${f(bond.required)}`,
            `locked:                  ${f(bond.locked)}`,
            `debt:                    ${f(bond.debt)}`,
            `pendingToSplit:          ${f(bond.pendingToSplit)}`,
            `delta:                   ${f(bond.delta)}  (isInsufficient: ${bond.isInsufficient})`,
            `rewards.available:       ${f(rewards?.available)}`,
            `feeSplits:               ${
              feeSplits.map((s) => `${Number(s.share) / 100}%`).join(', ') ||
              '—'
            }`,
            '—',
            `realExcess:              ${f(c.realExcess)}`,
            `realInsufficient:        ${f(c.realInsufficient)}`,
            `keysInsufficient:        ${f(c.keysInsufficient)}`,
            `claimableBond:           ${f(c.claimableBond)}`,
            `claimableBondAndRewards: ${f(c.claimableBondAndRewards)}`,
            `rewardsRemainder:        ${f(c.rewardsRemainder)}`,
            '—',
            `availableOptions:        [${actual}]`,
            `expectedOptions:         [${expected}]  ${match ? '✓' : '✗ MISMATCH'}`,
            `isPaused: ${isPaused}   isContract: ${isContract}`,
          ].join('\n')}
        </DataPre>
      </StyledAccordion>
    </TestBlock>
  );
};

const TestBlock = styled(Block)`
  padding: 16px;
`;

const StyledAccordion = styled(Accordion)`
  & > [type='button'] {
    padding: 0;
    min-height: 24px;
  }
  & > [type='button'] + div > div {
    padding: 8px 0 0;
  }
`;

const DataPre = styled.pre`
  background: var(--lido-color-backgroundSecondary);
  border-radius: 8px;
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
`;
