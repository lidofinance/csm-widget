import { PATH } from 'consts/urls';
import { IdvtcParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => (
  <GateLoaded>
    <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
      <Gate
        rule="ICS_APPLY_ENABLED"
        fallback={<Navigate path={PATH.TYPE_PARAMETERS} />}
      >
        <IdvtcParametersPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
