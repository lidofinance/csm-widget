import { useNodeOperatorId, useOperatorGroupStakeSummary } from 'modules/web3';
import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { GroupSummary } from './group-summary';
import { GroupGrid } from './styles';
import { OperatorCard } from './operator-card';

export const Group: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data, isPending } = useOperatorGroupStakeSummary(nodeOperatorId);

  return (
    <WhenLoaded loading={isPending} empty={!data && <>No Group</>}>
      <GroupGrid>
        <GroupSummary operators={data?.operators ?? []} />
        {data?.operators.map((stakeSummary) => (
          <OperatorCard
            key={String(stakeSummary.nodeOperatorId)}
            {...stakeSummary}
          />
        ))}
      </GroupGrid>
    </WhenLoaded>
  );
};
