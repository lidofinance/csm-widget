import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { ViewKeys } from './view-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const ViewKeysPage: FC = () => (
  <Layout
    title="View keys list"
    subtitle="Check the list of your keys"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageViewKeys}
  >
    <KeysPageSwitcher />
    <ViewKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
