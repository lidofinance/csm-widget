import { PATH } from 'consts/urls';
import { FC, useEffect } from 'react';
import { useInvites, useSessionStorage } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';

export const InvitesRedirect: FC = () => {
  const { data: invites } = useInvites();
  const navigate = useNavigate();
  const [skipRedirect, setSkipRedirect] = useSessionStorage<boolean>(
    'skip-invites-redirect',
    false,
  );

  useEffect(() => {
    if (invites?.length && !skipRedirect) {
      setSkipRedirect(true);
      void navigate(PATH.ROLES_INBOX);
    }
  }, [invites?.length, navigate, setSkipRedirect, skipRedirect]);

  return null;
};
