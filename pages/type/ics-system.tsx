import { PATH } from 'consts/urls';
import { IcsScoresPage } from 'features/ics';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
        <IcsScoresPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
