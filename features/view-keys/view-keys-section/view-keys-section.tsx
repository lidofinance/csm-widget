import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { useNodeOperatorKeys } from 'shared/hooks';
import { ViewKeysBlock } from './styles';
import { KeysTable } from './keys-table';
import { WhenLoaded } from 'shared/components';

export const ViewKeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: keys, initialLoading: loading } = useNodeOperatorKeys(id);

  return (
    <ViewKeysBlock>
      <WhenLoaded
        loading={loading}
        empty={!keys?.length && 'There are no keys to display'}
      >
        <KeysTable keys={keys} />
      </WhenLoaded>
    </ViewKeysBlock>
  );
};
