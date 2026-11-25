import { Card } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useOperatorsWithLockedBond } from 'modules/web3';
import { TableProvider } from 'providers/table-provider';
import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { LockedTable } from './locked-table';
import { sortFunctions } from './sort';

export const LockedSection: FC<{ module?: MODULE_NAME }> = ({ module }) => {
  const { data, isPending: loading } = useOperatorsWithLockedBond(module);

  return (
    <TableProvider
      data={data}
      sort={sortFunctions}
      defaultSort={{ column: 'until', direction: 'asc' }}
    >
      <Card
        align="stretch"
        padding={0}
        gap={0}
        clip
        dataTestId={{ root: 'lockedSectionBlock' }}
      >
        <WhenLoaded loading={loading} morePadding>
          <LockedTable />
        </WhenLoaded>
      </Card>
    </TableProvider>
  );
};
