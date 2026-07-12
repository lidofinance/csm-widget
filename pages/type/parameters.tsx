import { PATH } from 'consts/urls';
import { TypeParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <PageGate path={PATH.TYPE_PARAMETERS}>
      <TypeParametersPage />
    </PageGate>
  );
};

export default Page;

export const getServerSideProps = getProps();
