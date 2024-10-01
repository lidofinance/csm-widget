import { FC } from 'react';
import { Latice, TitledValue } from 'shared/components';
import { useNormalizeQueueFormData } from '../context';

export const Info: FC = () => {
  const { info, unqueuedCount, loading } = useNormalizeQueueFormData();
  return (
    <>
      <Latice variant="secondary">
        <TitledValue
          title="Unqueued keys count"
          loading={loading.isInfoLoading}
          value={unqueuedCount}
        />
        {info?.stuckValidatorsCount ? (
          <TitledValue warning title="Have stuck keys" />
        ) : null}
      </Latice>
    </>
  );
};
