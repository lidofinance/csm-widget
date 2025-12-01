import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { FC } from 'react';
import {
  FaqStrikeLifetime,
  FaqStrikeThreshold,
  SectionBlock,
  Stack,
} from 'shared/components';
import { TablePagination, TableProvider } from 'providers/table-provider';
import { hasStatus } from 'utils';
import { StrikesTable } from './strikes-table';

type WithStrikes = KeyWithStatus & Required<Pick<KeyWithStatus, 'strikes'>>;

export const StrikesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus(nodeOperatorId, (data) => {
    return data
      .filter(hasStatus(KEY_STATUS.WITH_STRIKES))
      .filter(
        hasStatus([KEY_STATUS.ACTIVE, KEY_STATUS.ACTIVATION_PENDING]),
      ) as WithStrikes[];
  });

  if (!keys?.length) return null;

  return (
    <SectionBlock title="Keys with Strikes">
      <TableProvider data={keys}>
        <Stack direction="column">
          <Text size="xs" color="secondary">
            Strikes are issued for bad performance. In case your key gets{' '}
            <FaqStrikeThreshold /> within <FaqStrikeLifetime /> the key will be
            ejected.
          </Text>
          <StrikesTable />
          <TablePagination />
        </Stack>
      </TableProvider>
    </SectionBlock>
  );
};
