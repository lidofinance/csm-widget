import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate replace path={PATH.KEYS} />
  </GateLoaded>
);

export default Page;
