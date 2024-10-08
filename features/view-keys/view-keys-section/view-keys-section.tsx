import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { useKeysWithStatus } from 'shared/hooks';
import { KeysTable } from './keys-table';
import { ViewKeysBlock } from './styles';

export const ViewKeysSection: FC = () => {
  const { data: keys, initialLoading: loading } = useKeysWithStatus();

  return (
    <ViewKeysBlock>
      <WhenLoaded
        loading={loading}
        empty={!keys?.length && 'There are no keys to display'}
      >
        <KeysTable data={keys} />
      </WhenLoaded>
    </ViewKeysBlock>
  );
};
