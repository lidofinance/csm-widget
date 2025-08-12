import { IcsApplyPage } from 'features/ics';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';

const ScoresPage: FC = () => {
  return (
    <GateLoaded>
      <IcsApplyPage />
    </GateLoaded>
  );
};

export default ScoresPage;
