import { PATH } from 'consts';
import { IcsApplyPage } from 'features/ics';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const ScoresPage: FC = () => {
  return (
    <GateLoaded>
      <Gate
        rule="IS_CONNECTED_WALLET"
        fallback={<Navigate path={PATH.TYPE_ICS_SYSTEM} />}
      >
        <IcsApplyPage />
      </Gate>
    </GateLoaded>
  );
};

export default ScoresPage;
