import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
// import { useNodeOperatorsWithLockedBond } from 'shared/hooks';
import { LockedTable } from './locked-table';
// DAPPNODE
import { useNodeOperatorsWithLockedBond } from 'dappnode/hooks/use-node-operators-with-locked-bond-api';

export const LockedSection: FC = () => {
  const { data, initialLoading: loading } = useNodeOperatorsWithLockedBond();

  return (
    <Block>
      <WhenLoaded
        loading={loading}
        empty={!data?.length && 'There are no Node Operators with Locked bond'}
      >
        <LockedTable data={data} />
      </WhenLoaded>
    </Block>
  );
};
