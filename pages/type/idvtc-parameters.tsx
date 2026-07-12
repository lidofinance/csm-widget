import { PATH } from 'consts/urls';
import { IdvtcParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => (
  <PageGate path={PATH.TYPE_DVT_PARAMETERS}>
    <IdvtcParametersPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
