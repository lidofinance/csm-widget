import { PATH } from 'consts/urls';
import { IcsApplyPage } from 'features/ics';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const ScoresPage: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="ICS_ENABLED" fallback={<Navigate path={PATH.HOME} />}>
        <Gate
          rule="ICS_CAN_APPLY"
          fallback={<Navigate path={PATH.TYPE_ICS_SYSTEM} />}
        >
          <IcsApplyPage />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default ScoresPage;
