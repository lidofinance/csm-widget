import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.SETTINGS} />
  </GateLoaded>
);

export default Page;
