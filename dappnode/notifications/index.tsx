import { PATH } from 'consts/urls';
import { NotificationsPage } from 'dappnode/notifications/notifications-page';
import { getFaqNotifications } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <NotificationsPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getStaticProps = getProps(getFaqNotifications);
