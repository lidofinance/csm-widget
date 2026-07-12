import { PATH } from 'consts/urls';
import { DvtDescriptionPage } from 'features/dvt';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <PageGate path={PATH.TYPE_DVT_DESCRIPTION}>
      <DvtDescriptionPage />
    </PageGate>
  );
};

export default Page;

export const getServerSideProps = getProps();
