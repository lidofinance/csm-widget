import { EmptyState, MessageBox, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useMyOperators, useShowRule } from 'shared/hooks';
import { CreateOperatorButton } from './create-operator-button';
import { GroupSection, GroupSectionSkeleton } from './group-section';
import { useMyOperatorsSections } from './hooks';
import { MyOperatorsSkeleton } from './my-operators-skeleton';
import { OperatorCard } from './operator-card';
import { OperatorsSection } from './operators-section';
import { MyOperatorsSummaryCard } from './summary-card';

export const MyOperators: FC = () => {
  const { data: roster, isPending, isError } = useMyOperators();
  const sections = useMyOperatorsSections(isPending ? undefined : roster);
  const check = useShowRule();

  if (isPending) return <MyOperatorsSkeleton />;
  if (isError && !roster) {
    return (
      <MessageBox variant="error">
        Failed to load your operators. Try again later.
      </MessageBox>
    );
  }
  if (!roster?.length) return <EmptyState title="No operators" />;

  const { cmPending, groups, ungroupedCm, csmFamily } = sections;

  return (
    <Stack direction="column" gap={52} data-testid="myOperatorsList">
      {cmPending ? (
        <GroupSectionSkeleton />
      ) : (
        groups.map((g) => (
          <GroupSection
            key={String(g.groupId)}
            nodeOperatorId={g.representative.nodeOperatorId}
          />
        ))
      )}
      {!cmPending && ungroupedCm.length > 0 && (
        <OperatorsSection
          title="CM Operators"
          dataTestId="cmOperatorsSection"
          titleTestId="cmOperatorsSectionTitle"
        >
          {ungroupedCm.map((operator) => (
            <OperatorCard
              key={`${operator.module}-${operator.nodeOperatorId}`}
              operator={operator}
            />
          ))}
        </OperatorsSection>
      )}
      {csmFamily.length > 0 && (
        <OperatorsSection
          title="CSM Operators"
          dataTestId="csmOperatorsSection"
          titleTestId="csmOperatorsSectionTitle"
          summary={
            csmFamily.length >= 2 ? <MyOperatorsSummaryCard /> : undefined
          }
        >
          {csmFamily.map((operator) => (
            <OperatorCard
              key={`${operator.module}-${operator.nodeOperatorId}`}
              operator={operator}
            />
          ))}
        </OperatorsSection>
      )}
      {check('CAN_CREATE') && <CreateOperatorButton />}
    </Stack>
  );
};
