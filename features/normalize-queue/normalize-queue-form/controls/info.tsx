import { FC } from 'react';
import { Latice, TitledValue } from 'shared/components';
import { useNormalizeQueueFormData } from '../context';

export const Info: FC = () => {
  const { unqueuedCount } = useNormalizeQueueFormData();
  return (
    <>
      <Latice variant="secondary">
        <TitledValue title="Unqueued keys count" value={unqueuedCount} />
      </Latice>
    </>
  );
};
