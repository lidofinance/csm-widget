import { PATH } from 'consts/urls';
import { TypeParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
        <TypeParametersPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
