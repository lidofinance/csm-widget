import { qaToolsEnabled } from 'config/qa-tools';
import { QaConfigPage } from 'features/qa-config';
import { GetStaticProps } from 'next';
import Page404 from './404';

const Page = () => (qaToolsEnabled ? <QaConfigPage /> : <Page404 />);

export default Page;

export const getStaticProps: GetStaticProps = () => ({
  props: { dummy: true },
});
