import { FC } from 'react';

import { Layout } from 'shared/components';
import { KeysPageSwitcher } from 'shared/navigate';
import { ViewKeys } from './view-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const ViewKeysPage: FC = () => (
  <Layout
    title="View keys list"
    subtitle="Check the list of your keys"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageViewKeys}
  >
    <KeysPageSwitcher />
    <ViewKeys />
  </Layout>
);
