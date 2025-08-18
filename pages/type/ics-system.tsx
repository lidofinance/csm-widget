import { IcsScoresPage } from 'features/ics';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <IcsScoresPage />
    </GateLoaded>
  );
};

export default Page;
