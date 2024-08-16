import { FC } from 'react';

import { Layout } from 'shared/components';
import { KeysPageSwitcher } from 'shared/navigate';
import { AddKeys } from './add-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const AddKeysPage: FC = () => (
  <Layout
    title="Submit validator keys"
    subtitle="Upload more keys"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageAddKeys}
  >
    <KeysPageSwitcher />
    <AddKeys />
  </Layout>
);
