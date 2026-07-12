import { PATH } from 'consts/urls';
import { MetadataPage } from 'features/metadata';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_METADATA}>
    <MetadataPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
