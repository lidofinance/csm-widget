import { PATH } from 'consts';
import { DvtApplyPage } from 'features/dvt';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const DvtApply: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="ICS_APPLY_ENABLED" fallback={<Navigate path={PATH.HOME} />}>
        <DvtApplyPage />
      </Gate>
    </GateLoaded>
  );
};

export default DvtApply;

export const getServerSideProps = getProps();
