import { IcsScoresPage } from 'features/ics';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page: FC = () => {
  return (
    <GateLoaded>
      <IcsScoresPage />
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
