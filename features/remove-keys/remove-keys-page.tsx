import { FC } from 'react';

import { Layout } from 'shared/components';
import { KeysPageSwitcher } from 'shared/navigate';
import { RemoveKeys } from './remove-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const RemoveKeysPage: FC = () => (
  <Layout
    title="Remove validator keys"
    subtitle="Remove keys that has not been deposited yet"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageRemoveKeys}
  >
    <KeysPageSwitcher />
    <RemoveKeys />
  </Layout>
);
