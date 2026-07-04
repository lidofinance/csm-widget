import { IdvtcDescriptionPage } from 'features/idvtc';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <GateLoaded>
      <IdvtcDescriptionPage />
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
