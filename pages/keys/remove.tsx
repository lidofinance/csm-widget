import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';

const QUERY = { mode: 'remove' };

const Page = () => (
  <GateLoaded>
    <Navigate replace path={PATH.KEYS_DELETE} query={QUERY} />
  </GateLoaded>
);

export default Page;
