import { PATH } from 'consts/urls';
import { StubRedirect } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => <StubRedirect path={PATH.SETTINGS} />;

export default Page;

export const getServerSideProps = getProps();
