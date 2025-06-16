import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { RemoveKeys } from './remove-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const RemoveKeysPage: FC = () => (
  <Layout
    title="Remove validator keys"
    subtitle="Remove keys that has not been deposited yet"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageRemoveKeys}
  >
    <KeysPageSwitcher />
    <RemoveKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
