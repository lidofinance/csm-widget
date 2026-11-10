import { Stack } from '@lidofinance/lido-app-ui';
import { FC, useMemo, useState } from 'react';
import type {
  MemberDto,
  RotationRequestDto,
} from 'modules/surveys-sdk/generated';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { RotationModal } from '../rotation/rotation-modal';
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
  const [rotatingIndex, setRotatingIndex] = useState<number | null>(null);
  const activeAddresses = useMemo(
    () => members.map((m) => m.address),
    [members],
  );

  return (
    <Stack gap={8} data-testid="membersSection">
      {members.map((member, index) => (
        <MemberCard
          key={member.address}
          index={index}
          member={member}
          state={deriveMemberCardState(index, request)}
          canManage={canManage}
          onRotate={() => setRotatingIndex(index)}
        />
      ))}

      {rotatingIndex !== null && members[rotatingIndex] && (
        <AppFormUi>
          <RotationModal
            index={rotatingIndex}
            member={members[rotatingIndex]}
            takenAddresses={collectTakenAddresses(
              activeAddresses,
              request,
              rotatingIndex,
            )}
            onClose={() => setRotatingIndex(null)}
          />
        </AppFormUi>
      )}
    </Stack>
  );
};
