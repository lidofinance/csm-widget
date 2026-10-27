import { PATH } from 'consts';
import { IdvtcApplyPage } from 'features/idvtc';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const IdvtcApply: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="ICS_APPLY_ENABLED" fallback={<Navigate path={PATH.HOME} />}>
        <IdvtcApplyPage />
      </Gate>
    </GateLoaded>
  );
};

export default IdvtcApply;

