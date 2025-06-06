import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { AcceptInviteForm } from './accept-invite-form';
import { Faq } from 'shared/components';

export const AcceptInvite = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <AcceptInviteForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
