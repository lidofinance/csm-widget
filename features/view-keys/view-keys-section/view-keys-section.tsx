import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { KeysTable } from './keys-table';
import { ViewKeysBlock } from './styles';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';

export const ViewKeysSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys, isPending: loading } =
    useOperatorKeysWithStatus(nodeOperatorId);

  return (
    <ViewKeysBlock data-testid="viewKeysBlock">
      <WhenLoaded
        loading={loading}
        empty={!keys?.length && 'There are no keys to display'}
      >
        <KeysTable keys={keys} />
      </WhenLoaded>
    </ViewKeysBlock>
  );
};
