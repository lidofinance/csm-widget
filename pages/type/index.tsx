import { PATH } from 'consts';
import { OperatorTypePage } from 'features/operator-type';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page: FC = () => (
  <GateLoaded>
    <Gate rule="IS_CSM_FAMILY_SCOPE" fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule="ICS_APPLY_ENABLED" fallback={<Navigate path={PATH.HOME} />}>
        <OperatorTypePage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;
