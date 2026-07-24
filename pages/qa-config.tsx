import { QaConfigPage } from 'features/qa-config';
import { GetStaticProps } from 'next';

const Page = () => <QaConfigPage />;

export default Page;

export const getStaticProps: GetStaticProps = () => ({
  props: { maintenance: true },
});
