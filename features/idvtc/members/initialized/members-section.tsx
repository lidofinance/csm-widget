import { Text } from '@lidofinance/lido-ui';
import { FC, useMemo, useState } from 'react';
import { Stack } from 'shared/components';
import type {
  MemberDto,
  RotationRequestDto,
} from 'modules/surveys-sdk/generated';
import {
  collectTakenAddresses,
  deriveMemberCardState,
} from '../utils/member-state';
import { MemberCard } from './member-card';

type MembersSectionProps = {
  members: MemberDto[];
  request: RotationRequestDto | null;
  canManage: boolean;
};

export const MembersSection: FC<MembersSectionProps> = ({
  members,
  request,
  canManage,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const activeAddresses = useMemo(
    () => members.map((m) => m.address),
    [members],
  );

  return (
    <Stack direction="column" gap="md" data-testid="membersSection">
      <Stack direction="column" gap="xxs">
        <Text as="h5" size="sm" weight="bold">
          Cluster member addresses
        </Text>
        <Text size="xs" color="secondary">
          Verify ownership of 4 additional Ethereum addresses in your validator
          cluster.
        </Text>
      </Stack>

      {members.map((member, index) => (
        <MemberCard
          key={member.address}
          index={index}
          member={member}
          state={deriveMemberCardState(index, request, editingIndex)}
          dimmed={editingIndex !== null && editingIndex !== index}
          canManage={canManage}
          takenAddresses={collectTakenAddresses(
            activeAddresses,
            request,
            index,
          )}
          onRotate={() => setEditingIndex(index)}
          onDone={() => setEditingIndex(null)}
        />
      ))}
    </Stack>
  );
};
