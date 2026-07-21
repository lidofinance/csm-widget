import { FC } from 'react';
import { FormBlock } from 'shared/components';
import type { MemberDto } from 'modules/surveys-sdk/generated';
import { MemberRow } from './member-row';

type MembersListProps = {
  members: MemberDto[];
};

export const MembersList: FC<MembersListProps> = ({ members }) => (
  <FormBlock $gap="xxl" data-testid="membersList">
    {members.map((member, index) => (
      <MemberRow key={member.address} member={member} index={index} />
    ))}
  </FormBlock>
);
