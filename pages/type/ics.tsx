import { IcsScoresPage } from 'features/ics-scores';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';

const ScoresPage: FC = () => {
  return (
    <GateLoaded>
      <IcsScoresPage />
    </GateLoaded>
  );
};

export default ScoresPage;
