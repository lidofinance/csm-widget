import { qaToolsEnabled } from 'config/qa-tools';
import { QaConfigPage } from 'features/qa-config';
import { GetStaticProps } from 'next';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import Page404 from './404';

// client-only: `isTestEnv` comes from `window.__env__` at runtime, SSR would mismatch
const Page = () => (
  <NoSSRWrapper>{qaToolsEnabled ? <QaConfigPage /> : <Page404 />}</NoSSRWrapper>
);

export default Page;

export const getStaticProps: GetStaticProps = () => ({
  props: { maintenance: true },
});
