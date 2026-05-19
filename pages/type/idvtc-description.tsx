import { DvtDescriptionPage } from 'features/dvt';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <GateLoaded>
      <DvtDescriptionPage />
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
