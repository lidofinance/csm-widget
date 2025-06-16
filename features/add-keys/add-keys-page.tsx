import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { AddKeys } from './add-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const AddKeysPage: FC = () => (
  <Layout
    title="Submit validator keys"
    subtitle="Upload more keys"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageAddKeys}
  >
    <KeysPageSwitcher />
    <AddKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
