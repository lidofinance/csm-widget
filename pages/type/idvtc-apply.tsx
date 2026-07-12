import { PATH } from 'consts';
import { DvtApplyPage } from 'features/dvt';
import { FC } from 'react';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const DvtApply: FC = () => {
  return (
    <PageGate path={PATH.TYPE_DVT_APPLY}>
      <DvtApplyPage />
    </PageGate>
  );
};

export default DvtApply;

export const getServerSideProps = getProps();
