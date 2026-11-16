import { useFaq } from 'faq';
import { Fragment, FC } from 'react';
import { Stack } from '@lidofinance/lido-app-ui';

import { Faq } from 'shared/components';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { Gate } from 'shared/navigate';
import { HubDepositQueue } from './deposit-queue/hub-deposit-queue';
import { KeysStatsCard } from './keys-stats';
import { KeysTableCard } from './keys-table';

export const KeysPage: FC = () => {
  const web3Key = useWeb3Key();
  const faq = useFaq('KEYS');

  return (
    <Layout wide pageName="ViewKeys" breadcrumbs={[{ label: 'Keys' }]}>
      <Fragment key={web3Key}>
        <Stack direction="column" gap={8}>
          <KeysStatsCard />
          <KeysTableCard />
          <Gate rule="IS_CSM_FAMILY">
            <HubDepositQueue />
          </Gate>
        </Stack>
      </Fragment>
      <Faq items={faq} />
    </Layout>
  );
};
