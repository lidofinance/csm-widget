import { PATH } from 'consts/urls';
import { IcsParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => (
  <PageGate path={PATH.TYPE_ICS_PARAMETERS}>
    <IcsParametersPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
