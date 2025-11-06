import { TypeParametersPage } from 'features/type-parameters';
import { FC } from 'react';
import { GateLoaded } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <TypeParametersPage />
    </GateLoaded>
  );
};

export default Page;
