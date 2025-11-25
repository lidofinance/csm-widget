import { TypeParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <GateLoaded>
      <TypeParametersPage />
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
