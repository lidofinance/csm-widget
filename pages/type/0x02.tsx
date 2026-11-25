import { Type0x02Page } from 'features/operator-type';
import { FC } from 'react';
import { PATH } from 'consts';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="IS_CSM_FAMILY_SCOPE" fallback={<Navigate path={PATH.HOME} />}>
        <Type0x02Page />
      </Gate>
    </GateLoaded>
  );
};

export default Page;
