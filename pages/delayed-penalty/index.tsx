import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { StubRedirect } from 'shared/navigate';

const Page = () => <StubRedirect path={PATH.DELAYED_PENALTY} />;

export default Page;

export const getServerSideProps = getProps();
