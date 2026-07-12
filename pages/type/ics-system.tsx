import { PATH } from 'consts/urls';
import { IcsScoresPage } from 'features/ics';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <PageGate path={PATH.TYPE_ICS_SYSTEM}>
      <IcsScoresPage />
    </PageGate>
  );
};

export default Page;

export const getServerSideProps = getProps();
