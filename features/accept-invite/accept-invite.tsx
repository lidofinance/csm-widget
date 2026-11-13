import { useWeb3Key } from 'shared/hooks';
import { AcceptInviteForm } from './accept-invite-form';

export const AcceptInvite = () => {
  const key = useWeb3Key();
  return <AcceptInviteForm key={key} />;
};
