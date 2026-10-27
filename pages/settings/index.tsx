import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.SETTINGS_ROLES} />
  </GateLoaded>
);

export default Page;

