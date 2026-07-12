import { PATH } from 'consts';
import { OperatorTypePage } from 'features/operator-type';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => (
  <PageGate path={PATH.TYPE}>
    <OperatorTypePage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
