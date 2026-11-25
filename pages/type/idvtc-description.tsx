import { IdvtcDescriptionPage } from 'features/idvtc';
import { FC } from 'react';
import { PATH } from 'consts';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="IS_CSM_FAMILY_SCOPE" fallback={<Navigate path={PATH.HOME} />}>
        <IdvtcDescriptionPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;
