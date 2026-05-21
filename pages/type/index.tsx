import { PATH } from 'consts';
import { OperatorTypePage } from 'features/operator-type';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => (
  <GateLoaded>
    <Gate
      rule="ICS_APPLY_ENABLED"
      fallback={<Navigate path={PATH.TYPE_PARAMETERS} />}
    >
      <OperatorTypePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
