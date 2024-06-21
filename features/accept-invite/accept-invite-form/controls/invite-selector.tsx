import { ChangeEventHandler, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { AcceptInviteFormInputType, useAcceptInviteFormData } from '../context';
import { InviteItem } from './invite-item';

export const InviteSelector = () => {
  const { setValue, watch } = useFormContext<AcceptInviteFormInputType>();
  const {
    invites,
    loading: { isInvitesLoading },
  } = useAcceptInviteFormData();
  const isLoading = isInvitesLoading;

  const selectedInvite = watch('invite');

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name;
      const m = name.match(/invite\.(\d+)\.checked/);
      const i = m?.[1] ? parseInt(m?.[1], 10) : 0;
      const invite = invites?.[i];

      setValue('invite', invite);
    },
    [invites, setValue],
  );

  if (isLoading) {
    return <div>...loading...</div>;
  }

  return (
    <Wrapper>
      {invites?.map((invite, index) => (
        <InviteItem
          key={`${invite.id}-${invite.manager ? 'm' : 'r'}`}
          index={index}
          invite={invite}
          name={`invite.${index}.checked`}
          checked={
            selectedInvite?.id === invite.id &&
            selectedInvite.manager === invite.manager
          }
          onChange={onChange}
        />
      ))}
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;
