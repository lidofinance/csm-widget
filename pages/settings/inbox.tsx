import { PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_INBOX}>
    <AcceptInvitePage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
