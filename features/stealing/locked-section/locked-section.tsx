import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { LockedTable } from './locked-table';
import { useOperatorsWithLockedBond } from 'modules/web3';

export const LockedSection: FC = () => {
  const { data, isPending: loading } = useOperatorsWithLockedBond();

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
