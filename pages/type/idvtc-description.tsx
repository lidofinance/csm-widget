import { IdvtcDescriptionPage } from 'features/idvtc';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <IdvtcDescriptionPage />
    </GateLoaded>
  );
};

export default Page;

