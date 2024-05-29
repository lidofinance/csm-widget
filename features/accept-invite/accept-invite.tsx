import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { AcceptInviteForm } from './accept-invite-form';

export const AcceptInvite = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <AcceptInviteForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
