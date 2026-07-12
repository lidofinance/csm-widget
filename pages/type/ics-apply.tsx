import { PATH } from 'consts';
import { IcsApplyPage } from 'features/ics';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const ScoresPage: FC = () => {
  return (
    <PageGate path={PATH.TYPE_ICS_APPLY}>
      <IcsApplyPage />
    </PageGate>
  );
};

export default ScoresPage;

export const getServerSideProps = getProps();
