import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.BOND} />
  </GateLoaded>
);

export default Page;

