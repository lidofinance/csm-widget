import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.TYPE_ICS_SYSTEM} />
  </GateLoaded>
);

export default Page;
