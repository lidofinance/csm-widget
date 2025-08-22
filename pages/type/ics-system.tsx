import { PATH } from 'consts/urls';
import { IcsScoresPage } from 'features/ics';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="ICS_ENABLED" fallback={<Navigate path={PATH.HOME} />}>
        <IcsScoresPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;
