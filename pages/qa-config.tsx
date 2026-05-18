import { QaConfigPage } from 'features/qa-config';
import { getProps } from 'utilsApi';

const Page = () => <QaConfigPage />;

export default Page;

export const getServerSideProps = getProps({ continueAnyway: true });
