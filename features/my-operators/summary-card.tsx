import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { Balance } from 'features/dashboard/bond/balance';
import { FC } from 'react';
import { Block, IssuesChip, Stack, TextBlock } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useMyOperatorsOverview } from 'shared/hooks';
import { TilesRow } from './styles';

export const SummaryCard: FC = () => {
  const {
    activeValidators,
    liveKeys,
    activeBalance,
    availableToClaim,
    bondBalance,
    totalIssues,
    isPending,
  } = useMyOperatorsOverview();

  return (
    <Block data-testid="myOperatorsSummary">
      <Stack direction="column" gap="xl">
        <Stack center spaceBetween>
          <Text as="h4" size="sm" weight={700}>
            My operators summary
          </Text>
          <IssuesChip
            issues={isPending ? undefined : totalIssues}
            data-testid="summaryIssuesChip"
          />
        </Stack>
        <TilesRow>
          <TextBlock
            data-testid="summaryActiveValidators"
            title="Active validators"
            help="Active validators out of all non-withdrawn keys across your operators"
            loading={isPending}
            description={
              <FormatToken
                amount={activeBalance}
                token={TOKENS.eth}
                maxDecimalDigits={2}
                trimTrailingZeros
                fallback=""
              />
            }
          >
            {activeValidators}
            <i> / {liveKeys}</i>
          </TextBlock>
          <Balance
            data-testid="summaryAvailableToClaim"
            title="Available to claim"
            loading={isPending}
            amount={availableToClaim}
            approx
          />
          <Balance
            data-testid="summaryBondBalance"
            title="Bond balance"
            loading={isPending}
            amount={bondBalance}
            approx
          />
        </TilesRow>
      </Stack>
    </Block>
  );
};
